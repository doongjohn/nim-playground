function postData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  }).then((response) => response.body)
}

Date.prototype.today = function() {
  return (
    (this.getDate() < 10 ? '0' : '') +
    this.getDate() +
    '/' +
    (this.getMonth() + 1 < 10 ? '0' : '') +
    (this.getMonth() + 1) +
    '/' +
    this.getFullYear()
  )
}

Date.prototype.timeNow = function() {
  return (
    (this.getHours() < 10 ? '0' : '') +
    this.getHours() +
    ':' +
    (this.getMinutes() < 10 ? '0' : '') +
    this.getMinutes() +
    ':' +
    (this.getSeconds() < 10 ? '0' : '') +
    this.getSeconds()
  )
}
