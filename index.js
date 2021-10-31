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
    const availablePackages = client.db("TravelX").collection("packages");
    const booksCollection = client.db("TravelX").collection("books");

    //add packages
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

        // get single product
        app.get('/placeBooking/:id', async (req, res) => {
            const id = req.params.id;
            const result = await availablePackages.findOne({_id:ObjectId(id)});
            res.send(result)
        });

        // addedItems
        app.post('/addedItem', async(req,res)=>{
           
           const result = await booksCollection.insertOne(req.body);
            if(result){
                res.send(result)
            }
          
        })

        //get added item
        app.get('/myOrders',async (req,res)=>{
            const result =await booksCollection.find({}).toArray();
            res.send(result)
        });
        
        //delete order
        app.delete('/deleteOrder/:email',async (req, res) => {
            const result = await booksCollection.deleteOne({
                email: req.params.email
              });
              res.send(result)
        });

        //delete package
        app.delete('/delete/:id',async (req,res)=>{
            const id = req.params.id;
            const result =await availablePackages.deleteOne({_id : ObjectId(id)})
            res.send(result)
        })

       
    });


    app.get('/', (req, res) => {
        res.send('Hello from server')
    });

    app.listen(port, () => {
        console.log('running from ', port)
    })