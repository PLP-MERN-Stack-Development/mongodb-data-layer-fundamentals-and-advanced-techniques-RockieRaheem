// insert_books.js - Script to populate MongoDB with sample book data

// Import MongoDB client
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Connection URI (replace with your MongoDB connection string if using Atlas)
// Supports environment variables for flexibility
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Database and collection names
const dbName = "plp_bookstore";
const collectionName = "books";

// Load sample book data from JSON to avoid duplication
const dataPath = path.join(__dirname, "data", "books.json");
const books = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Function to insert books into MongoDB
async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if collection already has documents
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(
        `Collection already contains ${count} documents. Dropping collection...`
      );
      await collection.drop();
      console.log("Collection dropped successfully");
    }

    // Insert the books
    const result = await collection.insertMany(books);
    console.log(
      `${result.insertedCount} books were successfully inserted into the database`
    );

    // Display the inserted books
    console.log("\nInserted books:");
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(
        `${index + 1}. "${book.title}" by ${book.author} (${
          book.published_year
        })`
      );
    });
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

// Run the function
insertBooks().catch(console.error);

/*
 * Example MongoDB queries you can try after running this script:
 *
 * 1. Find all books:
 *    db.books.find()
 *
 * 2. Find books by a specific author:
 *    db.books.find({ author: "George Orwell" })
 *
 * 3. Find books published after 1950:
 *    db.books.find({ published_year: { $gt: 1950 } })
 *
 * 4. Find books in a specific genre:
 *    db.books.find({ genre: "Fiction" })
 *
 * 5. Find in-stock books:
 *    db.books.find({ in_stock: true })
 */
