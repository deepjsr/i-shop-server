const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 mins

exports.handler = async function (event, context) {
  const path = event.path;
  const method = event.httpMethod;

  console.log(`Received request: ${method} ${path}`);

  if (path === "/api/hello") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello, world!" }),
    };
  }

  if (path === "/api/products" && method === "GET") {
    const cachedData = cache.get("products");
    if (cachedData) {
      return {
        statusCode: 200,
        body: JSON.stringify(cachedData),
      };
    }

    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 10;
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
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching products:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching products" }),
      };
    }
  }

  if (path === "/api/categories" && method === "GET") {
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo
        .collection("tblcategories")
        .find({})
        .toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching categories:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching categories" }),
      };
    }
  }

  if (path.startsWith("/api/categories/") && method === "GET") {
    const categoryname = decodeURIComponent(path.split("/").pop());
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo
        .collection("tblcategories")
        .find({ CategoryName: categoryname })
        .toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching categories by name:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching categories" }),
      };
    }
  }

  if (path === "/api/admin" && method === "GET") {
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo.collection("tbladmin").find({}).toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching admin data:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching admin data" }),
      };
    }
  }

  if (path === "/api/customers" && method === "GET") {
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo.collection("tblcustomers").find({}).toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching customers:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching customers" }),
      };
    }
  }

  if (path.startsWith("/api/customers/") && method === "GET") {
    const id = decodeURIComponent(path.split("/").pop());
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo
        .collection("tblcustomers")
        .find({ UserId: id })
        .toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching customer by ID:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching customer by ID" }),
      };
    }
  }

  if (path.startsWith("/api/products/") && method === "GET") {
    const id = parseInt(decodeURIComponent(path.split("/").pop()));
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      const documents = await dbo
        .collection("tblproducts")
        .find({ Id: id })
        .toArray();
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } catch (err) {
      console.error("Error fetching product by ID:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error fetching product by ID" }),
      };
    }
  }

  if (path === "/api/adminregister" && method === "POST") {
    const data = JSON.parse(event.body);
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      await dbo.collection("tbladmin").insertOne(data);
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Admin Registered Successfully" }),
      };
    } catch (err) {
      console.error("Error registering admin:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error registering admin" }),
      };
    }
  }

  if (path === "/api/itemregister" && method === "POST") {
    const data = JSON.parse(event.body);
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      await dbo.collection("tblproducts").insertOne(data);
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item Registered Successfully" }),
      };
    } catch (err) {
      console.error("Error registering item:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error registering item" }),
      };
    }
  }

  if (path === "/api/customerregister" && method === "POST") {
    const data = JSON.parse(event.body);
    try {
      await mongoose.connect(connectionString);
      const dbo = mongoose.connection.db;
      await dbo.collection("tblcustomers").insertOne(data);
      mongoose.connection.close();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Customer Registered Successfully" }),
      };
    } catch (err) {
      console.error("Error registering customer:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error registering customer" }),
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Endpoint not found" }),
  };
};
