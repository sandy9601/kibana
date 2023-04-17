const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// update a document in the "my_index" index
async function updateDocument(id, updatedData) {
  const { body: result } = await client.update({
    index: 'usersfromkafka',
    id,
    body: {
      doc: updatedData
    }
  });

  console.log(result);
}
// call the updateDocument function with the document ID and updated data
//updateDocument('uALFhYcBZglO_6S3nEJR', { userName: 'maheshPricne' });

// update documents in the "my_index" index that match the query
async function updateDocuments() {
  const { body: result } = await client.updateByQuery({
    index: 'usersfromkafka',
    body: {
        "query": {
            "bool": {
              "must": [
                { "match": { "isDeleted": "false" } },
                { "match": { "userName":"ranaNaidu"  } }
              ]
            }
          },
          "script": {
            "source": "ctx._source.isDeleted = params.isDeleted",
            "params": {
              "isDeleted": true
            }
          }
    }
  });

  console.log(result);
}

// call the updateDocuments function with a query and updated data
updateDocuments();
