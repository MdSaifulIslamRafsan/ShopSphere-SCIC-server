const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "shopsphere-scic-client.web.app",
      "shopsphere-scic-client.firebaseapp.com",
    ],
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.edk1eij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("ShopSphere-SCIC-Task");
    const productCollection = database.collection("product");

    app.get("/products", async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page - 1);
      const { order } = req.query;
      const search = req.query.search || "";
      const category = req.query.category;
      const brand = req.query.brand;

      const { minPrice, maxPrice } = req.query;

      const query = {
        productName: { $regex: search, $options: "i" },
      };
      if (brand) {
        query.brand = { $regex: brand, $options: "i" };
      }
      if (minPrice && maxPrice) {
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
      }
      if (category) {
        query.category = category;
      }
      let sortOrder = {};
      if (order === "Low to High") {
        sortOrder = { price: 1 };
      } else if (order === "High to Low") {
        sortOrder = { price: -1 };
      } else if (order === "Newest First") {
        sortOrder = { creationDate: -1 };
      }
      const result = await productCollection
        .find(query)
        .sort(sortOrder)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.get("/products-count", async (req, res) => {
      const search = req.query.search;
      const category = req.query.category;
      const { minPrice, maxPrice } = req.query;
      const brand = req.query.brand;
      const query = {
        productName: { $regex: search, $options: "i" },
      };
      if (minPrice && maxPrice) {
        query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
      }
      if (category) {
        query.category = category;
      }
      if (brand) {
        query.brand = { $regex: brand, $options: "i" };
      }
      const count = await productCollection.countDocuments(query);
      res.send({ count });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server side running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
