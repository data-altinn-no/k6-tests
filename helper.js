import { getAltinnToken } from './altinnToken.js'
import { subscriptions } from './config.js';

export function getParams(subscription = null, scope = null) {
    var subscriptionKey = subscription !== null ? subscriptions[subscription] : subscriptions['ebevis'];
    var params = {
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    }
    if (scope !== undefined) {
        params.headers.Authorization = "Bearer " + getAltinnToken(scope);
    } else {
        params.headers.Authorization = "Bearer " + getAltinnToken();
    }
    params.httpDebug = 'full';
    return params;
}