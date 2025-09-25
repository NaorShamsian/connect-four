function sendHttpGetRequest(url, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            callback(httpRequest.response, httpRequest.status);
        }
    };
    httpRequest.open('GET', url, true);
    httpRequest.send();
}

const sendHttpPostRequest = (url, callback, body) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4) {
            callback(httpRequest.response, httpRequest.status);
        }
    };
    httpRequest.open('POST', url, true);
    httpRequest.send(body);
}