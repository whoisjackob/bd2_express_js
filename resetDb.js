require("dotenv").config()

const {databaseConnection} = require("./config/mongo")
const products = require("./data/products.json")

const collectionName = "products"

databaseConnection.then(databaseConnected => Promise.all([
    databaseConnected,
    databaseConnected.listCollections({name: collectionName}).hasNext(),
]))
    .then(([databaseConnected, collectionExists]) => Promise.all([
        databaseConnected,
        collectionExists ? databaseConnected.dropCollection(collectionName) : null
    ]))
    .then(([databaseConnected]) => databaseConnected.collection(collectionName).insertMany(products))
    .then(() => console.log("Database reset"))
    .catch(console.error)
    .finally(() => process.exit())
