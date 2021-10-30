const express = require('express');
const app = express();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = 5000;
const bodyParser = require("body-parser")


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))


const uri = "mongodb+srv://TravelX:R3OcrgoqjvRnkY73@cluster0.myaif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

client.connect(err => {
    // console.log('connected to database')
    const availablePackages = client.db("TravelX").collection("packages");
    const booksCollection = client.db("TravelX").collection("books");

    app.post('/addPackages', async (req, res) => {
        const package = req.body;
        const result =await availablePackages.insertOne(package)
            res.send(result)
        })

        //get all products
        app.get('/packages', async (req, res) => {
            const allPackage = await availablePackages.find({}).toArray()
            .then(result=> res.send(result))
           

        });

        //delete product
        app.delete('/deleteProducts/:id', (req, res) => {
            const id = req.params.id;
            const result = productsCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })

        // get single product
        app.get('/placeBooking/:id', async (req, res) => {
            const id = req.params.id;
            const result = await availablePackages.findOne({_id:ObjectId(id)});
            res.send(result)
        });

        //update products
        app.put('/update/:id', (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) };
            console.log(filter)

            productsCollection.updateOne(filter, {
                $set: {
                    name: updatedInfo.name,
                    price: updatedInfo.price
                }
            })
                .then(result => res.send(result))

        });
        // addedItems
        app.post('/addedItem/:id', async(req,res)=>{
            const id = req.params.id;
            const result = await availablePackages.findOne({_id: ObjectId(id)});
            booksCollection.insertOne(result);
            res.send(result)
        })

        //get added item
        app.get('/myOrders', (req,res)=>{
            const result = booksCollection.find({}).toArray();
            console.log(result)
        })

        //add order old
        app.post('/addedOrder', (req, res) => {
            ordersCollection.insertOne(req.body)
                .then(result => res.send(result))
        });

        // my cart old
        app.get('/myCart/:email', async (req, res) => {


            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result)

        })
    });


    app.get('/', (req, res) => {
        res.send('Hello from server')
    });

    app.listen(port, () => {
        console.log('running from ', port)
    })