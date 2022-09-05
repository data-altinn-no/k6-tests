import { useToken } from './config.js'
import { generateJUnitXML, reportPath } from './report.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { group } from 'k6';

import getAccreditations from './testAccredidationList.js';
import getEvidenceCodes from './testMetadataEvidenceCodes.js';
import createHarvestDelete from './testCreateHarvestDelete.js';
import testRequirements from './testRequirements.js';

let env = __ENV.env;
export let options = useToken ? null : {
    tlsAuth: [
        {
            domains: [baseUrl],
            cert: __ENV.cert,
            key: __ENV.key,
        },
    ]
};

export default function () {
    group(`Running tests in ${env}`, () => {
        getAccreditations();
        getEvidenceCodes();
        createHarvestDelete();
        testRequirements();
    });
};

export function handleSummary(data) {
    let result = {};
    result['stdout'] = textSummary(data, { indent: ' ', enableColors: true }),
        result[reportPath('junit')] = generateJUnitXML(data, 'dan');
    return result;
}