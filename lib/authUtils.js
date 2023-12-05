const axios = require('axios');
const crypto = require('crypto');

async function getDigestAuthHeaders(url, username, password) {
    try {
        await axios.get(url);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('WWW-Authenticate Header:', error.response.headers['www-authenticate']);
            return error.response.headers['www-authenticate'];
        } else {
            throw error;
        }
    }
  }
  
  function parseDigestHeader(digestHeader) {
    const parts = digestHeader.split(', ');
    const values = {};
    parts.forEach(part => {
        const [key, value] = part.split('=');
        values[key] = value.replace(/"/g, '');
    });
    return values;
  }
  
  function createResponseHash(username, password, method, path, realm, nonce, qop, nc, cnonce) {
    // Use the path directly without converting to a URL object
    const ha1 = crypto.createHash('md5').update(`${username}:${realm}:${password}`).digest('hex');
    const ha2 = crypto.createHash('md5').update(`${method}:${path}`).digest('hex');
    return crypto.createHash('md5').update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest('hex');
  }

module.exports = { getDigestAuthHeaders, parseDigestHeader, createResponseHash };