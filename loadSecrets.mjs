import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { CertificateClient } from "@azure/keyvault-certificates";

var keyVaults = {
    dev: "kv-nadobe-test-dev",
    qa: "kv_nadobe-test-qa",
    staging: "kv-nadobe-prod-staging",
    prod: "kv-nadobe-prod-prod"
};

export default async function loadSecrets() {
    const enviroment = process.argv[2];
    const credential = new DefaultAzureCredential();
    const keyVaultName = keyVaults[enviroment];
    const url = `https://${keyVaultName}.vault.azure.net`;
    const secretClient = new SecretClient(url, credential);
    const certClient = new CertificateClient(url, credential);
    const certificate = await certClient.getCertificate("digdir-cert");
    const subscriptions = (await secretClient.getSecret(enviroment + "-subscriptions")).value;
    const tokenUsername = (await secretClient.getSecret("tokenUsername")).value;
    const tokenPassword = (await secretClient.getSecret("tokenPassword")).value;
    const useToken = process.argv[3];
    var secrets = {
        subscriptions: subscriptions,
        tokenUsername: tokenUsername,
        tokenPassword: tokenPassword,
        certificate: certificate.cer,
        key: certificate.keyId,
        env: enviroment,
        useToken: useToken
    }
    return JSON.stringify(secrets);
}
loadSecrets().then((secrets) => {
    console.log(secrets);
});