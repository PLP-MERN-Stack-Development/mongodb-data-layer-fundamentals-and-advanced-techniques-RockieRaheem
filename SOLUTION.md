# MongoDB Week 1 Assignment - Complete Solution

## Assignment Overview

This repository contains a complete solution for the Week 1 MongoDB assignment covering:

- ✅ MongoDB database setup (`plp_bookstore`)
- ✅ Collection creation (`books`)
- ✅ Data insertion (12 books with all required fields)
- ✅ Basic CRUD operations
- ✅ Advanced queries with projection, sorting, pagination
- ✅ Aggregation pipelines
- ✅ Indexing and performance analysis

## Files Structure

```
├── data/books.json              # Sample book dataset (12 books)
├── insert_books.js              # Script to populate MongoDB
├── queries.js                   # All required queries and operations
├── package.json                 # Dependencies and npm scripts
├── README.md                    # Setup and run instructions
└── examples/                    # Additional MongoDB examples
```

## Quick Start

### Method 1: With MongoDB (Recommended)

```bash
# Install dependencies
npm install

# Set your MongoDB connection (optional, defaults to localhost)
export MONGODB_URI="mongodb://localhost:27017"

# Populate database
npm run insert

# Run all queries
npm run queries
```

### Method 2: Offline Demo (No MongoDB Required)

```bash
# Install dependencies
npm install

# Run queries in simulation mode
npm run queries:offline
```

## Assignment Task Coverage

### ✅ Task 1: MongoDB Setup

- Database: `plp_bookstore`
- Collection: `books`
- Connection supports both local MongoDB and Atlas

### ✅ Task 2: Basic CRUD Operations

All implemented in `queries.js`:

- Find books by genre
- Find books published after a year
- Find books by author
- Update book price
- Delete book by title

### ✅ Task 3: Advanced Queries

- Complex filtering (in_stock AND published_year > 2010)
- Projection (title, author, price only)
- Sorting (price ascending/descending)
- Pagination with limit/skip (5 books per page)

### ✅ Task 4: Aggregation Pipelines

- Average price by genre
- Author with most books
- Books grouped by publication decade

### ✅ Task 5: Indexing

- Single field index on `title`
- Compound index on `author` + `published_year`
- Performance analysis with `explain()`

## Sample Data

The dataset includes 12 books with all required fields:

- `title` (string)
- `author` (string)
- `genre` (string)
- `published_year` (number)
- `price` (number)
- `in_stock` (boolean)
- `pages` (number)
- `publisher` (string)

## Output Examples

### CRUD Operations

```
Find genre=Fiction -> 4 docs
Find after year=1950 -> 4 docs
Find author=George Orwell -> 2 docs
Updated price of 1984
```

### Advanced Queries

```
In stock after 2010 -> []
Projection shows title, author, price only
Sort by price (ascending/descending)
Pagination: page 1 (5 books), page 2 (5 books)
```

### Aggregation Results

```
Average price by genre:
- Fantasy: $17.49 (2 books)
- Dystopian: $12.00 (2 books)
- Fiction: $10.74 (4 books)

Author with most books: George Orwell (2 books)

Books by decade:
- 1810s: 1, 1840s: 1, 1850s: 1, 1920s: 1
- 1930s: 2, 1940s: 2, 1950s: 2, 1960s: 1, 1980s: 1
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017`)
- `NO_DB=1`: Run in offline simulation mode

## Submission Checklist

- ✅ `insert_books.js` - Data insertion script
- ✅ `queries.js` - All required queries and operations
- ✅ `README.md` - This documentation
- ✅ Screenshot placeholder - `screenshot.png` (add your MongoDB Compass/Atlas screenshot here)

## Notes

- The solution works both online (with MongoDB) and offline (simulation mode)
- All 5 assignment tasks are fully implemented
- Code follows MongoDB best practices
- Extensive error handling and logging included
