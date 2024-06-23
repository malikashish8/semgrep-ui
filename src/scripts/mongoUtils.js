import { MongoClient } from 'mongodb';

const DB = 'semgrep';
const DB_URI = 'mongodb://localhost:27017';

async function listCollections() {
    const client = new MongoClient(DB_URI);

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

function collectionNameFromFileName(fileName) {
    return fileName.split('.').slice(0, -1).join('')
}

async function createCollectionFromJson(collectionName, jsonData) {
    const client = new MongoClient(DB_URI);

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

async function collectionStats(collectionName) {
    const client = new MongoClient(DB_URI);

    try {
        const allIssues = await getAllDocuments(collectionName)
        console.log(`Collection ${collectionName} has ${allIssues.length} documents`);
        const securityIssues = allIssues.filter(document => document.extra.metadata.category === "security")
        console.log(`security issues: ${securityIssues.length}`)

        // print breakdown by value of status
        let statusBreakdown = {};
        securityIssues.forEach((doc) => {

            if (statusBreakdown[doc.status]) {
                statusBreakdown[doc.status]++;
            } else {
                statusBreakdown[doc.status] = 1;
            }
        });
        console.log('Status breakdown:\n', statusBreakdown);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

async function getAllDocuments(collectionName) {
    const client = new MongoClient(DB_URI);

    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(collectionName);
        const documents = await collection.find().toArray();
        return documents;
    } catch (error) {
        console.error('Error in getAllDocuments():', error);
    } finally {
        await client.close();
    }
}

async function dropCollection(collectionName) {
    const client = new MongoClient(DB_URI);

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

// async function runThis() {
//     var collectionName = 'juice-shop';
//     await listCollections();
//     await collectionStats(collectionName);
//     // await dropCollection(collectionName);
// }

// runThis();

module.exports = {
    collectionNameFromFileName,
    listCollections,
    createCollectionFromJson,
    getAllDocuments,
    dropCollection
}