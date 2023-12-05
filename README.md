## MongoDBAutoIP
Automatically update MongoDB Atlas IP whitelist when server ip changes, and delete the old ones.

## Features
- Automatically fetches the current server's IP address.
- Adds the current IP address to the MongoDB Atlas whitelist.
- Removes outdated IP addresses from the whitelist.
- Handles authentication with MongoDB Atlas API.

## Installation
Install the module using npm:

npm install mongoDBAutoIP

## Usage Instructions:
1. Add the following to your app.js file.
const mongoDBAutoIP = require('mongoDBAutoIP');
require('dotenv').config();

const config = {
    projectId: process.env.ATLAS_PROJECT_ID, // add to .env or Config Vars
    publicKey: process.env.ATLAS_API_PUBLIC, // add to .env or Config Vars
    privateKey: process.env.ATLAS_API_PRIVATE, // add to .env or Config Vars
    username: publicKey,
    password: privateKey,
}

const { checkAndUpdateIP } = mongoDBAutoIP.setup(config);

checkAndUpdateIP();


2. Get Project ID and API Keys:
- Login to MongoDB Atlas
- Click the access manager dropdown in the header next to your organization name
- On the far right click the "Create API Key" button.
- Give it all permissions.
- Copy your public and private keys and add them to your .env or Config Vars like this:
  ATLAS_API_PUBLIC = myPUBLICapikey
  ATLAS_API_PRIVATE = myPRIVATEapikey

- On the left sidebar on the organization page, click projects. Now on the far right, click the ellipses (...) button and "Copy Project ID"/
- add your project ID to your .env or Config Vars like this:
  projectId = myPROJECTid

  ### Additional Notes
- None Right now.