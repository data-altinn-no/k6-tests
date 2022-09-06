import http from 'k6/http';
import {group} from 'k6';
import { baseUrl } from './config.js'
import { getParams } from './helper.js';
import { assert } from './assert.js';

var accreditationBody = {
    "requestor": "991825827",
    "subject": "998997801",
    "evidenceRequests": [
        {
            "evidenceCodeName": "RestanserV2",
        }
    ],
    "externalReference": "Postdeploy_test",
    "languageCode": "no-nb"
};

var url = (base) => {
    return `${base}/authorization`;
};

export default function testRequirements() {
    group('Requirement tests', () => {
        testConsentRequirement();
        testMaskinPortenScopeRequirement();
        testProvideOwnTokenRequirement();
        testPartyRequirement();
    });
}

function testConsentRequirement() {
    var params = getParams("ebevis")
    accreditationBody.consentReference = "Postdeploy_test";
    
    group('[ConsentRequirement test] Positive consent requirement test', () => {
        accreditationBody.evidenceRequests[0].requestConsent = "true";
        let res = http.post(url(baseUrl), JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST RestanserV2 - is status 200': [(r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        });
        delete accreditationBody.evidenceRequests[0].requestConsent;
    });
    group('[ConsentRequirement test] Negative consent requirement test', () => {
        let res = http.post(url(baseUrl), JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST RestanserV2 - is status 403': [(r) => r.status === 403, (r) => `Expected 403, got ${r.status}, body: ${r.body}`]
        });
    })
}

function testMaskinPortenScopeRequirement() {
    accreditationBody.evidenceRequests[0].evidenceCodeName = "TildaMetadatav1";

    group('[MaskinportenScopeRequirement test] Positive mp scope requirement', () => {
        var params = getParams('tilda', 'tilda');
        let res = http.post(url(baseUrl), JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST TildaMetadatav1 - is status 200': [(r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        });
    })

    group('[MaskinportenScopeRequirement test] Negative mp scope requirement', () => {
        var params = getParams('tilda', 'dihe');
        let res = http.post(url(baseUrl), JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST TildaMetadatav1 - is status 403': [(r) => r.status === 403, (r) => `Expected 403, got ${r.status}, body: ${r.body}`]
        });
    })
}

function testPartyRequirement() {
    var params = getParams('dihe', 'dihe');
    accreditationBody.evidenceRequests[0].evidenceCodeName = "SummertSkattegrunnlag";
    accreditationBody.subject = "07056120453";

    group('[PartyRequirement test] Positive party requirement test', () => {
        accreditationBody.requestor = "991825827";
        let res = http.post(`${url(baseUrl)}?tokenonbehalfof=owner`, JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST SummertSkattegrunnlag - is status 200': [(r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        });
    })

    group('[PartyRequirement test] Negative party requirement test', () => {
        accreditationBody.requestor = "998997801";
        let res = http.post(`${url(baseUrl)}?tokenonbehalfof=owner`, JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST SummertSkattegrunnlag - is status 403': [(r) => r.status === 403, (r) => `Expected 403, got ${r.status}, body: ${r.body}`]
        });
    })
}

function testProvideOwnTokenRequirement() {
    var params = getParams('dihe', 'dihe');
    accreditationBody.subject = '07056120453';
    accreditationBody.evidenceRequests[0].evidenceCodeName = 'FregPerson';

    group('[ProvideOwnTokenRequirement test] Test with OnBehalfOfToken set to owner', () => {
        let res = http.post(`${url(baseUrl)}?tokenonbehalfof=owner`, JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST FregPerson - is status 200': [(r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        });
    });

    group('[ProvideOwnTokenRequirement test] Test with no token provided', () => {
        let res = http.post(url(baseUrl), JSON.stringify(accreditationBody), params);
        assert(res, {
            'POST FregPerson - is status 403': [(r) => r.status === 403, (r) => `Expected 403, got ${r.status}, body: ${r.body}`]
        });
    });
}