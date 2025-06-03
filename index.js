import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 mins

// Define __filename and __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "i-Shop API",
      version: "1.0.0",
      description: "API documentation for i-Shop",
    },
    servers: [
      {
        url: "https://i-shop-server.onrender.com/",
      },
    ],
  },
  apis: [__filename], // Now __filename works in ES module
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Error fetching products
 */
app.get("/products", async (req, res) => {
  const cachedData = cache.get("products");
  if (cachedData) {
    return res.json(cachedData);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    await mongoose.connect(connectionString);
    const dbo = mongoose.connection.db;
    const documents = await dbo
      .collection("tblproducts")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    cache.set("products", documents);
    res.send(documents);
    mongoose.connection.close();
  } catch (err) {
    res.status(500).send({ message: "Error fetching products" });
  }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of All categories
 *       500:
 *         description: Error fetching categories
 */
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

/**
 * @swagger
 * /categories/{categoryname}:
 *   get:
 *     summary: Retrieve a category by name
 *     parameters:
 *       - in: path
 *         name: categoryname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the category
 *     responses:
 *       200:
 *         description: A category
 *       500:
 *         description: Error fetching category
 */
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

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Retrieve a list of admin data
 *     responses:
 *       200:
 *         description: A list of admin data
 *       500:
 *         description: Error fetching admin data
 */
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

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     responses:
 *       200:
 *         description: A list of customers
 *       500:
 *         description: Error fetching customers
 */
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

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer
 *     responses:
 *       200:
 *         description: A customer
 *       500:
 *         description: Error fetching customer
 */
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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A product
 *       500:
 *         description: Error fetching product
 */
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

/**
 * @swagger
 * /adminregister:
 *   post:
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserId:
 *                 type: string
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Password:
 *                 type: string
 *               Email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *       500:
 *         description: Error registering admin
 */
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

/**
 * @swagger
 * /itemregister:
 *   post:
 *     summary: Register a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *               Title:
 *                 type: string
 *               Image:
 *                 type: string
 *               Price:
 *                 type: number
 *               Description:
 *                 type: string
 *               Email:
 *                 type: string
 *               Category:
 *                 type: string
 *               Address:
 *                 type: string
 *               DOB:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item registered successfully
 *       500:
 *         description: Error registering item
 */
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

/**
 * @swagger
 * /customerregister:
 *   post:
 *     summary: Register a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserId:
 *                 type: string
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Password:
 *                 type: string
 *               Gender:
 *                 type: string
 *               Email:
 *                 type: string
 *               Mobile:
 *                 type: string
 *               Address:
 *                 type: string
 *               DOB:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer registered successfully
 *       500:
 *         description: Error registering customer
 */
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

const PORT = process.env.PORT || 8090;
app.listen(PORT, () =>
  console.log(`Server Listening: http://127.0.0.1:${PORT}`)
);
