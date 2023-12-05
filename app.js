
require('dotenv').config();
const mongoDBAutoIP = require('mongodbautoip'); require('dotenv').config();


const publicKey = process.env.ATLAS_API_PUBLIC; // add to .env or Config Vars
const privateKey = process.env.ATLAS_API_PRIVATE; // add to .env or Config Vars

const config = {
    projectId: process.env.ATLAS_PROJECT_ID,
    publicKey: publicKey,
    privateKey: privateKey,
    username: publicKey,
    password: privateKey,
}


// after port set/defined
const { checkAndUpdateIP } = mongoDBAutoIP.setup(config);

checkAndUpdateIP().then(() => {
  http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to update IP whitelist on startup:', error);
  // Even if IP update fails, you might still want to start the server
  http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});