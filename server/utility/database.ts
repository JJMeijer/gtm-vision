import { Firestore } from '@google-cloud/firestore';

const database = new Firestore();

export const websiteDatabase = database.collection('websites');
