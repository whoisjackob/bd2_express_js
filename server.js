require("dotenv").config()

const {databaseConnection} = require("./config/mongo")
const express = require("express")
const app = express()
const products = require("./routes/products")

app.use(express.json())

app.use((req, res, next) => databaseConnection
    .then(databaseConnected => {
        req.databaseConnected = databaseConnected
    })
    .finally(() => next())
)

app.use("/products", products)

const port = process.env.EXPRESS_PORT || 5000
app.listen(port, () => console.log(`Server listening on port ${port}`))
