const { MongoClient } = require('mongodb');
const { readFileSync } = require('fs');
const { semgrepJsonFilePath } = require('../app/app.config');

const DB = 'semgrep';

async function listCollections() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(DB);
        const collections = await database.listCollections().toArray();

        console.log('Collections:');
        collections.forEach((collection) => {
            console.log(collection.name);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

function loadJSON(jsonFilePath) {
    const data = readFileSync(jsonFilePath);
    return JSON.parse(data);
}

function collectionNameFromJson(jsonFilePath) {
    return jsonFilePath.split('/').slice(-1)[0].split('.').slice(0, -1).join('')
}

async function createCollectionFromJson(jsonFilePath) {
    var jsonData = loadJSON(jsonFilePath);
    const collectionName = collectionNameFromJson(jsonFilePath);
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(DB);
        await database.createCollection(collectionName);
        const collection = database.collection(collectionName);
        // fix each result before insertion
        jsonData.results.forEach((result) => {
            // bring important fields to the top level
            result.fingerprint = result.extra.fingerprint;
            result._id = result.fingerprint;
            result.severity = result.extra.severity;
            // add additional fields
            result.status = 'new';
            result.ignoreReason = '';
            result.internalLink = '';
            // drop redundant fields
            delete result.extra.fingerprint;
            delete result.extra.severity;
        });
        await collection.insertMany(jsonData.results);
        console.log(`Collection ${collectionName} created`);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.close();
    }
}

async function documentsCount(collectionName) {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`Collection ${collectionName} has ${count} documents`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

async function getAllDocuments(collectionName) {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(collectionName);
        const documents = await collection.find().toArray();
        return documents;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

async function dropCollection(collectionName) {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(DB);
        await database.dropCollection(collectionName);
        console.log(`Collection ${collectionName} dropped`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}
async function runThis() {
    // await dropCollection(collectionNameFromJson(semgrepJsonFilePath));
    await createCollectionFromJson(semgrepJsonFilePath);
    // await listCollections();
    // documentsCount(collectionNameFromJson(semgrepJsonFilePath));

    // getAllDocuments(collectionNameFromJson(semgrepJsonFilePath)).then((documents) => {
    //     documents.filter(r => r.status === 'ignored').forEach((r) => {
    //         console.log(r._id);
    //     });
    // });
}

runThis();

module.exports = {
    collectionNameFromJson,
    listCollections,
    createCollectionFromJson,
    documentsCount,
    getAllDocuments,
    dropCollection
}