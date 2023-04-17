const { Kafka } = require('kafkajs');

async function produce(req,res,next) {
const data =req.body
data.isDeleted=false
  const kafka = new Kafka({
    clientId: 'kibana',
    brokers: ['localhost:9092', 'localhost:9093']
  });
  const producer = kafka.producer();
  await producer.connect();
  console.log('producer created');

  const producerData = await producer.send({
    topic: 'kibana',
    messages: [
        {
            value:JSON.stringify(data),
            partition:0
        }
    ]
  });
  console.log(`produced data ${JSON.stringify(producerData)}`)
next()
}



module.exports={produce}