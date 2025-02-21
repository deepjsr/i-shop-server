import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins

app.get("/products", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo.collection("tblproducts").find({}).toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching products" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo.collection("tblcategories").find({}).toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching categories" });
  }
});

app.get("/categories/:categoryname", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo
      .collection("tblcategories")
      .find({ CategoryName: req.params.categoryname })
      .toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching categories" });
  }
});

app.get("/admin", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo.collection("tbladmin").find({}).toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching admin data" });
  }
});

app.get("/customers", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo.collection("tblcustomers").find({}).toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching customers" });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo
      .collection("tblcustomers")
      .find({ UserId: req.params.id })
      .toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching customer by ID" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo
      .collection("tblproducts")
      .find({ Id: parseInt(req.params.id) })
      .toArray();
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching product by ID" });
  }
});

app.post("/adminregister", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const data = {
      UserId: req.body.UserId,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: req.body.Password,
      Email: req.body.Email,
    };
    await dbo.collection("tbladmin").insertOne(data);
    console.log("Record Inserted");
    res.send({ message: "Admin Registered Successfully" });
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error registering admin" });
  }
});

app.post("/itemregister", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const data = {
      Id: req.body.Id,
      Title: req.body.title,
      Image: req.body.image,
      Price: req.body.price,
      Description: req.body.description,
      Email: req.body.Email,
      Category: req.body.category,
      Address: req.body.Address,
      DOB: req.body.DOB,
    };
    await dbo.collection("tblproducts").insertOne(data);
    console.log("Record Inserted");
    res.send({ message: "Item Registered Successfully" });
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error registering item" });
  }
});

app.post("/customerregister", async (req, res) => {
  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const data = {
      UserId: req.body.UserId,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: req.body.Password,
      Gender: req.body.Gender,
      Email: req.body.Email,
      Mobile: req.body.Mobile,
      Address: req.body.Address,
      DOB: req.body.DOB,
    };
    await dbo.collection("tblcustomers").insertOne(data);
    console.log("Record Inserted");
    res.send({ message: "Customer Registered Successfully" });
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error registering customer" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server Listening: http://127.0.0.1:${PORT}`)
);
