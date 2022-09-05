import http from 'k6/http';
import { baseUrl } from './config.js'
import { getParams } from './helper.js';
import { assert } from "./assert.js";
import { fail, group } from 'k6';

var accreditationBody = JSON.stringify({
    "requestor": "958935420",
    "subject": "992037601",
    "evidenceRequests": [
        {
            "evidenceCodeName": "UnitBasicInformation"
        }
    ],
    "consentReference": "Postdeploy_test",
    "externalReference": "Postdeploy_test",
    "languageCode": "no-nb"
});

export default function testCreateHarvestDelete() {
    group('Harvest test', () => {
        let accreditationId = testCreate();
        testHarvest(accreditationId);
        testDelete(accreditationId);
    });
}

function testCreate() {
    var params = getParams(null, null);
    let res = http.post(baseUrl + '/v1/authorization', accreditationBody, params);
    let accreditationId = res.status == 200 || res.status == 201 ? JSON.parse(res.body).id : null;
    group('Create accredidation', () => {
        assert(res, {
            'POST accreditation - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
            'POST accreditation - is status 200': [(r) => r.status === 200, (r) => "Expected 200, got " + r.status + ", body: " + r.body],
            'POST accreditation - has accreditation': [(r) => accreditationId != null, () => "AccreditationId is null"]
        });
        if (accreditationId == null) {
            fail("Accreditation is null, cannot continue");
        }
    });
    return accreditationId;
}

function testHarvest(accreditationId) {
    var params = getParams(null, null);
    let res = http.get(baseUrl + '/v1/evidence/' + accreditationId + '/UnitBasicInformation', params);
    group('Harvest with accredidation', () => {
        assert(res,
            {
                'GET unitBasicInformation - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                'GET unitBasicInformation - is status 200': [(r) => r.status === 200, (r) => "Expected 200, got " + r.status + ", body: " + r.body]
            });
    });
}

function testDelete(accreditationId) {
    var params = getParams(null, null);
    let res = http.del(baseUrl + '/v1/accreditations/' + accreditationId, null, params);
    group('Delete accredidation', () => {
        assert(res,
            {
                'DELETE accreditation - is status 204': [(r) => r.status === 204, (r) => "Expected 204, got " + r.status + ", body: " + r.body],
                'DELETE accreditation - response body is empty': [(r) => r.body.length == 0, (r) => "Body was not zero length: " + r.body],
            });
    });
}