// scripts/uploadimage.js
import 'dotenv/config';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const PINATA_JWT = process.env.VITE_PINATA_JWT;
const FILE_PATH = './Badge.png'; // path to your badge image

if (!PINATA_JWT) {
  console.error('❌ Missing VITE_PINATA_JWT in your .env file!');
  process.exit(1);
}

async function uploadToPinata() {
  try {
    console.log('📤 Uploading badge to Pinata...');

    // create form-data manually
    const formData = new FormData();
    formData.append('file', fs.createReadStream(FILE_PATH));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Pinata upload failed:', result);
      throw new Error(result.error || response.statusText);
    }

    console.log('✅ Upload complete!');
    console.log('🔗 CID:', result.IpfsHash);
    console.log(`🌍 View on IPFS: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
  }
}

uploadToPinata();
