const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function updateDocuments(data) {
  const { updateData, filterData } = data;
  console.log(filterData);
  const { body: result } = await client.updateByQuery({
    index: 'usersfromkafka',
    body: {
      query: {
        bool: {
          should: [
            {
              match: { isDeleted: 'false' }
            },

            {
                match: filterData
            }
          ],
          minimum_should_match: 2
        }
      },
      script: {
        source: `ctx._source.${Object.keys(updateData)[0]} = params.${
          Object.keys(updateData)[0]
        }`,
        params: updateData
      }
    }
  });
  console.log(result);
}

async function updateConsume(req, res, next) {
  try {
    const userName = req.params.userName;
    const kafka = new Kafka({
      clientId: 'kibana',
      brokers: ['localhost:9092', 'localhost:9093']
    });

    const consumer = kafka.consumer({ groupId: 'kibana' });
    await consumer.connect();
    console.log('consumer connected');
    await consumer.subscribe({
      topic: 'kibana',
      fromBeginning: true
    });
    await consumer.run({
      eachMessage: async ({ topic, partiotion, message }) => {
        const data = JSON.parse(message.value);
        updateDocuments(data);
        console.log(`message recieved ${message.value}`);
      }
    });
    return res.send('updated data');
    //next();
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}

module.exports = { updateConsume };
