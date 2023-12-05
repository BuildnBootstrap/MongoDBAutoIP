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