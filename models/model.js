const { MongoClient } = require('mongodb');
const url = process.env.mongourl;
const client = new MongoClient(url);
const dbName = 'kibanaKafka';

async function dbConnect() {
  const result = await client.connect();
  const db = result.db(dbName);
  console.log('mongodb connected');
  return db.collection('kafkaTask');
}

const users =   ()=>{
    return  (
    class User {
      constructor(fullName, userName, mobileNumber, email, password) {
        this.fullName = fullName;
        this.userName = userName;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.password = password;
        this.followers = [];
        this.following = [];
        this.isDeleted=false
        this.timeStamp = new Date();
      }
    }
    )
    }

module.exports = { dbConnect,users };
