# MongoDB Fundamentals - Week 1

## Setup Instructions

Before you begin this assignment, please make sure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - This is included with MongoDB Community Edition
3. **Node.js** - [Download here](https://nodejs.org/)

### Node.js Package Setup

Once you have Node.js installed, run the following commands in your assignment directory:

```bash
# Initialize a package.json file
npm init -y

# Install the MongoDB Node.js driver
npm install mongodb
```

## Assignment Overview

This week focuses on MongoDB fundamentals including:

- Creating and connecting to MongoDB databases
- CRUD operations (Create, Read, Update, Delete)
- MongoDB queries and filters
- Aggregation pipelines
- Indexing for performance

## Submission

Complete all the exercises in this assignment and push your code to GitHub using the provided GitHub Classroom link.

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install MongoDB locally or set up a MongoDB Atlas account
4. Run the provided `insert_books.js` script to populate your database
5. Complete the tasks in the assignment document

## How to run

You can run these scripts either against a real MongoDB instance (online mode) or without MongoDB using a simulated dataset (offline mode).

1. Real MongoDB (recommended if available)

```bash
# Optionally set your Atlas/local connection string
export MONGODB_URI="mongodb://localhost:27017"  # or your Atlas URI

# Populate the database with sample data
node insert_books.js

# Run all required queries, aggregations, and indexes
node queries.js
```

2. Offline dry-run (no MongoDB needed on this machine)

```bash
# Simulate all queries using the local dataset in data/books.json
export NO_DB=1
node queries.js
```

Notes:

- Online mode uses database `plp_bookstore` and collection `books`.
- Offline mode prints simulated results for queries, aggregations, and index operations; use online mode to get actual explain plans and DB effects.

## Files Included

- `Week1-Assignment.md`: Detailed assignment instructions
- `insert_books.js`: Script to populate your MongoDB database with sample book data
- `queries.js`: All required CRUD, advanced queries, aggregations, and indexing (supports online/offline)
- `data/books.json`: Sample dataset used by scripts and offline mode
- `examples/`: Extra examples for connecting with Node.js and mongosh

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account) — optional if using offline mode
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)

## Submission checklist

- insert_books.js (provided, supports MONGODB_URI)
- queries.js with all tasks completed
- README.md (this file) with instructions
- Screenshot of MongoDB Compass/Atlas showing `plp_bookstore.books` and sample data (name it `screenshot.png` in the repo)

If you cannot run MongoDB here, still commit the code and include the offline run outputs by pasting your terminal output into a new file `offline-output.txt` (optional).
