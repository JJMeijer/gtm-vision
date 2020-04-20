import Firestore from '@google-cloud/firestore';
import dotenv from 'dotenv';

// Init Dotenv
dotenv.config();

const prod = process.env.NODE_ENV === 'production';

const firestoreSettings = prod ? {} : {
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_LOCATION,
};

const database = new Firestore(firestoreSettings);

const collectionName = prod ? 'websites' : 'websites-dev';

const websiteDatabase = database.collection(collectionName);

// eslint-disable-next-line import/prefer-default-export
export { websiteDatabase };
