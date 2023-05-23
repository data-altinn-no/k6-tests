import http from 'k6/http';
import { group, check } from 'k6';
import { assert } from "./assert.js";
import { baseUrl } from './config.js'
import { getParams } from './helper.js';

export default function testEvidenceCodes(evidenceCodes) {

    var subjects = {
        "CertificateOfRegistration": "992037601",
    };

    group('Test all evidenceCodes', () => {

        evidenceCodes.forEach(ec => {            
            let accreditationId = createAccreditation(ec, subjects[ec.evidenceCodeName]);
            if (accreditationId !== null) {
                harvestWithAccreditation(ec, accreditationId, subjects[ec.evidenceCodeName]);
                deleteAccreditation(accreditationId);
            }
        });
    });
}


function createAccreditation(evidenceCode, subject) {

    var accreditationBody = JSON.stringify({
        "requestor": "958935420",
        "subject": subject, 
        "evidenceRequests": [
            {
                "evidenceCodeName": evidenceCode.evidenceCodeName
            }
        ],
        "consentReference": "Postdeploy_test",
        "externalReference": "Postdeploy_test",
        "languageCode": "no-nb"
    });
    
    var params = getParams(evidenceCode.belongsToServiceContext.toLowerCase(), null);
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

function harvestWithAccreditation(evidenceCode, accreditationId, subject) {
    let params = getParams(null, null);

    let res = http.get(
        baseUrl + '/evidence/' + accreditationId + '/' +        
        evidenceCode.evidenceCodeName + '?subject=' + subject, params);
    group('Harvest with accreditation', () => {
        if (check(res, {
            'GET evidence - is status 200': (r) => r.status === 200
        })) {
            assert(res,
                {
                    'GET evidence - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                });
        } else {
            console.error(`"Expected 200, got ${res.status}, body: ${res.body}`)
        }
    });
}


function deleteAccreditation(accreditationId) {
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

