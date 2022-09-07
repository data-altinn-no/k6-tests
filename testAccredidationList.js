import { group } from 'k6';
import http from 'k6/http';
import { assert } from './assert.js';  
import { baseUrl } from './config.js'
import { getParams } from './helper.js';

function accredidationTest() {
    var params = getParams(null, null);
    console.log(params);
    group('Test accredidation list', () => {
        let res = http.get(baseUrl + '/accreditations/', params);
        assert(res,{
            'GET accredidation - is status 200': [ (r) => r.status === 200, (r) => `Expected 200, got ${r.status}, body: ${r.body}`]
        })
    })
    
}

export default function getAccreditations() {
    accredidationTest();
}