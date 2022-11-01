if(__ENV.K6_SECRETS) {
    var secrets = JSON.parse(__ENV.K6_SECRETS);
    __ENV.subscriptions = secrets.subscriptions;
    __ENV.tokenUsername = secrets.tokenUsername;
    __ENV.tokenPassword = secrets.tokenPassword;
    __ENV.cert = secrets.certificate;
    __ENV.key = secrets.key;
    __ENV.env = secrets.env;
    __ENV.useToken = secrets.useToken;
} else {
    try {
        JSON.parse(__ENV.subscriptions);
    } catch (error) {
        throw new Error('Environment variables not set.')
    }
}

export const baseUrls = {
    dev: "https://dev-api.data.altinn.no/v1",
    qa: "https://apim-nadobe-qa.azure-api.net/v1",
    staging: "https://test-api.data.altinn.no/v1",
    prod: "https://api.data.altinn.no/v1"
};

export const baseUrl = baseUrls[__ENV.env];
export const subscriptions = JSON.parse(JSON.parse(__ENV.subscriptions));
export let useToken = __ENV.useToken !== undefined && __ENV.useToken
