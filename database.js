require('dotenv').config();
const { MongoClient } = require("mongodb");
const url = process.env.DB_CONNECTION_SECRET || "mongodb+srv://SansarKakkar_db_user:TCsaPaTmM3NyP3Zr@personaldatabase.ytvvoos.mongodb.net/devtinder";
const client = new MongoClient(url);
const dbName = "devtinder";
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('userdata');
  const data={
  };
  const insert1=await collection.insertMany([data]);
  console.log("inserted documents=>",insert1)
  const findResult = await collection.find({}).toArray();
  console.log('Found documents =>', findResult);
  return 'done.';
}
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());