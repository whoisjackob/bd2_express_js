const {MongoClient} = require("mongodb")

const host = process.env.MONGO_HOST || "localhost"
const port = process.env.MONGO_PORT || 27017
const database = process.env.MONGO_DATABASE
const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

const client = new MongoClient(`mongodb://${username}:${password}@${host}:${port}`)

const databaseConnection = client.connect()
    .then(clientConnected => {
        console.log("Connected to MongoDB")

        return clientConnected.db(database)
    })
    .catch(console.error)

module.exports = {databaseConnection}
