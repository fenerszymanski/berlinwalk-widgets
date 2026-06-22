const SCRIPT_URL = "http://localhost:8080/berlin-bouncer-page/berlin-bouncer-page-element.js";
const BASE_URL = new URL('../', SCRIPT_URL).toString();
console.log(new URL('berlin-bouncer/index.html', BASE_URL).toString());
