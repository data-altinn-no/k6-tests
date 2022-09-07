import http from "k6/http";
import encoding from "k6/encoding";

let tokenUsername = JSON.parse(__ENV.tokenUsername);
let tokenPassword = JSON.parse(__ENV.tokenPassword);

const credentials = `${tokenUsername}:${tokenPassword}`;
const encodedCredentials = encoding.b64encode(credentials);
const tokenRequestOptions = {
  headers: {
    Authorization: `Basic ${encodedCredentials}`,
  },
};

export function getAltinnToken(scope) {
  let token;
  if (scope !== undefined) {
    token = http.get(`http://altinn-testtools-token-generator.azurewebsites.net/api/GetEnterpriseToken?env=tt02&scopes=altinn:dataaltinnno/${scope}&org=digdir&orgNo=991825827`, tokenRequestOptions);
  } else {
    token = http.get("http://altinn-testtools-token-generator.azurewebsites.net/api/GetEnterpriseToken?env=tt02&scopes=altinn:dataaltinnno&org=digdir&orgNo=991825827", tokenRequestOptions);
  }
  return token.body;
}