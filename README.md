## MongoDBAutoIP
Automatically update MongoDB Atlas IP whitelist when server ip changes, and delete the old ones.

## Features
- Automatically fetches the current server's IP address.
- Adds the current IP address to the MongoDB Atlas whitelist.
- Removes outdated IP addresses from the whitelist. (can set in ipUtils.js whitelist_retention_period, currently 24hrs.)
- Handles authentication with MongoDB Atlas API, using the HTTP Digest.

## Why
Locking down your database to only in use IPs is one of the #1 security rules. When using shared environments, the IP address is not static and in platforms like heroku it changes several times a day. You can either enable 0.0.0.0/0 which allows all connections (bad), or use a solution like Fixie (https://usefixie.com/), or Quotaguard (https://www.quotaguard.com/) which can be tougher to scale for an indiehacker with no revenue. Simpler scripts could be written in the past using request or digest-fetch, but those are depricated so I've built that in.

## Installation
Install the module using npm:

```javascript
npm install mongoDBAutoIP
```

## Usage Instructions:
**1. Add the following to your app.js file.**
```javascript
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


// After Port set/defined, 
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
```


**2. Get Project ID and API Keys:**
- Login to MongoDB Atlas (https://cloud.mongodb.com/)
- Click the access manager dropdown in the header next to your organization name.
- On the far right click the "Create API Key" button.
- Give it all permissions (needs personal read/write).
- Copy your public and private keys and add them to your .env or Config Vars like this:
```javascript
  ATLAS_API_PUBLIC = myPUBLICapikey
  ATLAS_API_PRIVATE = myPRIVATEapikey
  ```

- On the left sidebar on the organization page, click projects. Now on the far right, click the ellipses (...) button and "Copy Project ID".
- add your project ID to your .env or Config Vars like this:
```javascript
  projectId = myPROJECTid
  ```

  ### Additional Notes
- To adjust the whitelist_retention_period, go to lib/apiUtils.js and change the following (may add to options in the future): 
```javascript
const WHITELIST_RETENTION_PERIOD = 24 * 60 * 60 * 1000; //Currently 24hrs
  ```

### About the Author
- **Find me** on https://twitter.com/BuildnBootstrap
- Working on https://www.jobflows.com/
- Tip - ETH 0x35195758d35C4E407041E484cc16bE67397ABf3c