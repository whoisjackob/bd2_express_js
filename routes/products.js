const { ObjectId } = require("mongodb")

const router = require("express").Router()

router.use((req, res, next) => {
    req.productsCollection = req.databaseConnected.collection("products")
    next()
})

router.get("/", (req, res) =>
    req.productsCollection.find().toArray()
        .then(products => res.status(200).json({products}))
)

router.post("/", (req, res) => {
    const {
        title,
        description,
        price,
        stock,
        currency
    } = req.body

    const product = {
        title,
        description,
        price,
        stock,
        currency
    }
    // check if product name is uniqe
    x = req.productsCollection.findOne({'title': product.title})

    if (x) {
        res.status(400).json({error: "Product name already exists"})
    }

    req.productsCollection.insertOne(product)
        .then(({insertedId}) => res.status(201).json({product: {
            ...product,
            _id: insertedId
        }}))
})

router.put("/:id", (req, res) => {
    const _id = ObjectId(req.params.id)

    const {
        title,
        description,
        price,
        stock,
        currency
    } = req.body

    const product = {
        title,
        description,
        price,
        stock,
        currency
    }
    const productStripped = Object.entries(product).reduce((result, [key, value]) => value===undefined ?
        result :
        {...result, [key]: value},
    {})

    req.productsCollection.updateOne({_id}, {$set: productStripped})
        .then(_result => res.status(200).json({}))
})

router.delete("/:id", (req, res) => {
    const _id = ObjectId(req.params.id)

    req.productsCollection.deleteOne({_id})
        .then(_result => res.status(200).json({}))
})

router.get("/report", (req, res) =>
    req.productsCollection.aggregate([{$project: {
        title: "$title",
        stock: "$stock",
        total: {
            $multiply: ["$price", "$stock"]
        },
        currency: "$currency"
    }}]).toArray()
        .then(result => res.status(200).json({result}))
)

module.exports = router
