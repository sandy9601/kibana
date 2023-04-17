const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function consume(req, res, next) {
  try {
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
        const data= JSON.parse(message.value)
        const index = {
          index: 'usersfromkafka',
          body: {
            ...data
          }
        };
        await client.index(index);
        console.log(`message recieved ${message.value}`);
      }
    });
    next();
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}


module.exports = { consume };
