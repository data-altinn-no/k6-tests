import http from 'k6/http';
import { baseUrl } from './config.js'
import { getParams } from './helper.js';
import { assert } from "./assert.js";
import { check, group } from 'k6';

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
        if (accreditationId !== null) {
            testHarvest(accreditationId);
            testDelete(accreditationId);
        }
    });
}

function testCreate() {
    var params = getParams(null, null);
    let res = http.post(baseUrl + '/authorization', accreditationBody, params);
    let accreditationId = res.status == 200 || res.status == 201 ? JSON.parse(res.body).id : null;
    group('Create accredidation', () => {
        if (check(res, {
            'POST accreditation - is status 200': (r) => r.status === 200
        })) {
            assert(res, {
                'POST accreditation - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                'POST accreditation - has accreditation': [(r) => accreditationId != null, () => "AccreditationId is null"]
            });
            if (accreditationId == null) {
                console.error("Accreditation is null, cannot continue");
            }
        } else {
            console.error(`"Expected 200, got ${res.status}, body: ${res.body}`)
        }
    });
    return accreditationId;
}

function testHarvest(accreditationId) {
    var params = getParams(null, null);
    let res = http.get(baseUrl + '/evidence/' + accreditationId + '/UnitBasicInformation', params);
    group('Harvest with accredidation', () => {
        if (check(res, {
            'GET unitBasicInformation - is status 200': (r) => r.status === 200
        })) {
            assert(res,
                {
                    'GET unitBasicInformation - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                });
        } else {
            console.error(`"Expected 200, got ${res.status}, body: ${res.body}`)
        }
    });
}

function testDelete(accreditationId) {
    var params = getParams(null, null);
    let res = http.del(baseUrl + '/accreditations/' + accreditationId, null, params);
    group('Delete accredidation', () => {
        if (check(res, {
            'DELETE accreditation - is status 204': (r) => r.status === 204
        })) {
            assert(res,
                {
                    'DELETE accreditation - response body is empty': [(r) => r.body.length == 0, (r) => "Body was not zero length: " + r.body],
                });
        } else {
            console.error(`"Expected 204, got ${res.status}, body: ${res.body}`)
        }
    });
}