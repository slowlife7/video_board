function httpGetRequest(url, responseType) {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      console.log(url);
      xhr.responseType = "json";
      xhr.onerror = event => {
        reject(`Network error: ${event}`);
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(`XHR load error: ${xhr.statusText}`);
        }
      };
      xhr.send();
    } catch (err) {
      reject(err.message);
    }
  });
};