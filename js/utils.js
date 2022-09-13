async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.body
}

async function postDataWithTimeout(url = '', data = {}, timeout) {
  // Default options are marked with *
  const response = await fetchWithTimeout(url, {
    timeout: timeout,
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.body
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
