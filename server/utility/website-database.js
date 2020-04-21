import Firestore from '@google-cloud/firestore';

const database = new Firestore();

const websiteDatabase = database.collection('websites');

export default websiteDatabase;
