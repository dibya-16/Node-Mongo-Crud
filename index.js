const express=require('express');
//const cors = require("cors");//eta use hobe jokhn different folder er moddhe connection korbo.tokhn middleware hishabe use hobe
const bodyParser=require("body-parser");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

//app.use(bodyParser.urlencoded({extended:false}));//form theke post korle eta use korte hoy
//password="A4YE7cwH2o7DQhgB";


//middleware
//app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/',(req,res)=>{ 
    //res.send("My new mongo db project");
    res.sendFile(__dirname+"/index.html")
})

const uri = "mongodb+srv://rs:rsm2@cluster0.guhkckm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const productCollection = client.db("newdb").collection("products");
    //get products
    app.get('/products',async(req,res)=>{
      const query = {};
      const cursor = productCollection.find(query)//.find(query).limit(4) ebhabe just 4 tah dekhabo emn fix korte pari 
      const products = await cursor.toArray();
      res.send(products);
      
  })
  //load products in update
  app.get("/loadProduct/:id",async(req,res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await productCollection.findOne(query);
    res.send(result);
  })
  //add new products or insert products
  app.post("/addProducts",async(req,res)=>{
    const product=req.body;
    console.log("new product added",product);
    const result = await productCollection.insertOne(product);//insertMany()
    res.send(result);

    
  })
  //update
  app.put("/updateProduct/:id",async(req,res){
    const id = req.params.id;
    const updateProduct = req.body;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            name: updateProduct.name,
            price: updateProduct.price,
            quantity: updateProduct.quantity
        }
    };
    const result = await productCollection.updateOne(filter, updatedDoc, options);//updateMany()
    res.send(result);
  })
  //delete
  app.delete("/delete/:id",async(req,res){
    console.log(req.params.id);
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await productCollection.deleteOne(query);//deleteMany()
    res.send(result);
  })
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) =>{
  res.send('Running My Node CRUD Server');
});

app.listen(port, () =>{
  console.log('CRUD Server is running');
})


/////////////////////Old Version/////////////////////////////

{/*
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'yQgwjNcRYJiVdX5';

const uri = "mongodb+srv://organicUser:yQgwjNcRYJiVdX5@cluster0.bzdnt.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  
  app.get('/products', (req, res) => {
    productCollection.find({})//.find({}).limit(4) ebhabe just 4 tah dekhabo emn fix korte pari 
    .toArray( (err, documents) =>{//err=error
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray ( (err, documents) =>{
      res.send(documents[0]);
    })
  })
  
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      res.redirect('/')
    })
  })

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })

});


app.listen(3000);
*/}