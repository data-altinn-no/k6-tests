import { group } from 'k6';
import http from 'k6/http';
import { assert } from './assert.js';  
import { baseUrl } from './config.js'
import { getParams } from './helper.js';

function accredidationTest() {
    var params = getParams(null, null);
    group('Test accredidation list', () => {
        const res = http.get(baseUrl + '/v1/accreditations/', params);
        assert(res,{
            'GET accredidation - is status 200': [ (r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        })
    })
    
}

export default function getAccreditations() {
    accredidationTest();
}