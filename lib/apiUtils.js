const axios = require('axios');
const crypto = require('crypto');
const { getDigestAuthHeaders, parseDigestHeader, createResponseHash } = require('./authUtils');



async function makeAuthenticatedRequest(fullUrl, username, password, method = 'GET', data = null) {
    const digestHeader = await getDigestAuthHeaders(fullUrl, username, password);
    const { realm, nonce, qop } = parseDigestHeader(digestHeader);
  
    const nc = '00000001'; // nonce count - number of requests you've made
    const cnonce = crypto.randomBytes(24).toString('hex'); // client nonce
  
    // Extract the path from the full URL
    const urlObj = new URL(fullUrl);
    const path = urlObj.pathname + urlObj.search;
    const responseHash = createResponseHash(username, password, method, path, realm, nonce, qop, nc, cnonce);
  
    const authHeader = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${path}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${responseHash}", opaque=""`;
  
    const options = {
      method: method,
      headers: { 'Authorization': authHeader },
      url: fullUrl,
    };
  
    if (data && method === 'POST') {
      options.data = data;
      options.headers['Content-Type'] = 'application/json';
    }
  
    try {
      const response = await axios(options);
      console.log(`Response from ${method} request:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} request:`, error);
      throw error;
    }
  }
  

module.exports = { makeAuthenticatedRequest };