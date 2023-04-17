const { Kafka } = require("kafkajs")

async function createPartition(){

const kafka = new Kafka({
clientId :"kibana",
brokers:["localhost:9092","localhost:9093"]
})
const admin = kafka.admin()
await admin.connect()

admin.createTopics({
    topics:[
        {
          topic:"kibana",
          numPartitions:1
        }
    ]
})
console.log("partions created")
//admin.disconnect()
}
createPartition()