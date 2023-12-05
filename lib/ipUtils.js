const axios = require('axios');
const { makeAuthenticatedRequest } = require('./apiUtils');

const WHITELIST_RETENTION_PERIOD = 24 * 60 * 60 * 1000; //Currently 24hrs


// Function to get public IP address of your server
async function getCurrentIP() {
    // This example uses the 'ipify' service; you can use any other similar service
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  }

// Function to add a new IP address to the MongoDB Atlas whitelist
async function addToWhitelist(newIpAddress, config) {
    const { projectId, publicKey, privateKey } = config;

  const whitelistUrl = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/accessList`;



  // Fetch existing whitelist entries
  const existingEntries = await makeAuthenticatedRequest(whitelistUrl, publicKey, privateKey);
  const now = new Date();
  const formattedDate = now.toISOString();

  // Add new IP if not in the whitelist
  if (!existingEntries.results.some(entry => entry.ipAddress === newIpAddress)) {

    const whitelistEntry = { 
      ipAddress: newIpAddress, 
      comment: `Updated by MongoDBAutoIP - ${formattedDate}` 
    };

 /*   const whitelistEntry = { ipAddress: newIpAddress, comment: "Updated by my application" }; */
    const addResponse = await makeAuthenticatedRequest(whitelistUrl, publicKey, privateKey, 'POST', [whitelistEntry]);
    console.log('Response from Adding IP:', addResponse);

    // Introduce a short delay
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay

    const updatedEntries = await makeAuthenticatedRequest(whitelistUrl, publicKey, privateKey);
    console.log('Updated Whitelist Entries:', updatedEntries.results);
  }

// Optionally, remove old IPs
for (const entry of existingEntries.results) {
  if (entry.comment.startsWith("Updated by MongoDBAutoIP -")) {
    // Extract date from the comment
    const commentParts = entry.comment.split(' - ');
    if (commentParts.length > 1) {
      const entryDate = new Date(commentParts[1]);
      if (entryDate.getTime() + WHITELIST_RETENTION_PERIOD < now.getTime()) {
        // Construct the URL for removing this IP address from the whitelist
        const removeUrl = `${whitelistUrl}/${encodeURIComponent(entry.cidrBlock)}`;

        try {
          const removeResponse = await makeAuthenticatedRequest(removeUrl, publicKey, privateKey, 'DELETE');
          console.log(`Removed old IP address: ${entry.ipAddress}`, removeResponse);
        } catch (error) {
          console.error(`Error removing IP address: ${entry.ipAddress}`, error);
        }
      }
    }
  }
}
}

module.exports = { getCurrentIP, addToWhitelist };