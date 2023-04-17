const { Kafka } = require('kafkajs');

async function updateProduce(req,res,next) {
const updateData =req.body
const filterData = req.params
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
            value:JSON.stringify({updateData,filterData}),
            partition:0
        }
    ]
  });
  console.log(`produced data ${JSON.stringify(producerData)}`)
next()
}



module.exports={updateProduce}