import http from 'k6/http';
import { group, check } from 'k6';
import { assert } from "./assert.js";
import { baseUrl } from './config.js'
import { getParams } from './helper.js';

export default function testMetadataEvidenceCodes() {
    var evidenceCodes = testMetadata();
    testPublicMetadata();

    return evidenceCodes;
}

function testMetadata() {
    let params = getParams(null, null);
    let res = http.get(baseUrl + '/metadata/evidencecodes', params);
    group('MetadataEvidenceCode test', () => {
        if (check(res, {
            'GET evidenceCodes - is status 200': (r) => r.status === 200
        })) {
            assert(res, {
                'GET evidenceCodes - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                'GET evidenceCodes - response contains more than 40 evidencecodes': [(r) => r.json().length > 40, (r) => `Expected more than 40, found ${r.json().length}`],
                'GET evidenceCodes - evidencecodes contains more than one source': [(r) => r.json().every(ec => ec.values.length >= 1), () => 'One or more evidencecodes did not contain a source.']
            });
        } else {
            console.error(`Expected 200, got ${res.status}, body: ${res.body}`);
        }
    });
    return res;
}

function testPublicMetadata() {
    let params = getParams(null, null);
    let res = http.get(baseUrl + '/public/metadata/evidencecodes', params);
    group('PublicMetadataEvidenceCode test', () => {
        if (check(res, {
            'GET public evidenceCodes - is status 200': (r) => r.status === 200
        })) {
            assert(res, {
                'GET public evidenceCodes - has response body': [(r) => r.body.length > 0, () => "Body was zero length"],
                'GET public evidenceCodes - response contains more than 40 evidence codes': [(r) => r.json().length > 40, (r) => `Expected more than 40, found ${r.json().length}`],
                'GET public evidenceCodes - evidencecodes contains more than one source': [(r) => r.json().every(ec => ec.values.length >= 1), () => 'One or more evidencecodes did not contain a source.']
            });
        } else {
            console.error(`Expected 200, got ${res.status}, body: ${res.body}`);
        }
    });
}