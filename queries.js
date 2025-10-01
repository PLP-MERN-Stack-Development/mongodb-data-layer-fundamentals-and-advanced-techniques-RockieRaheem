const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const NO_DB = process.env.NO_DB === "1" || process.env.NO_DB === "true";
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "plp_bookstore";
const collectionName = "books";

// Helpers for offline mode
function loadLocalBooks() {
  const p = path.join(__dirname, "data", "books.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function project(doc, projection) {
  if (!projection) return doc;
  const out = {};
  for (const k of Object.keys(projection)) {
    if (projection[k]) out[k] = doc[k];
  }
  return out;
}

async function runOnline() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const books = db.collection(collectionName);

  // Task 2: Basic CRUD
  const findByGenre = async (genre) => books.find({ genre }).toArray();
  const findAfterYear = async (year) =>
    books.find({ published_year: { $gt: year } }).toArray();
  const findByAuthor = async (author) => books.find({ author }).toArray();
  const updatePrice = async (title, newPrice) =>
    books.updateOne({ title }, { $set: { price: newPrice } });
  const deleteByTitle = async (title) => books.deleteOne({ title });

  // Task 3: Advanced
  const inStockAfter2010 = async () =>
    books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
  const projectionExample = async () =>
    books
      .find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } })
      .toArray();
  const sortByPriceAsc = async () =>
    books.find({}).sort({ price: 1 }).toArray();
  const sortByPriceDesc = async () =>
    books.find({}).sort({ price: -1 }).toArray();
  const paginate = async (page = 1, pageSize = 5) =>
    books
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

  // Task 4: Aggregation
  const avgPriceByGenre = async () =>
    books
      .aggregate([
        {
          $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" },
            count: { $sum: 1 },
          },
        },
        { $sort: { averagePrice: -1 } },
      ])
      .toArray();

  const authorWithMostBooks = async () =>
    books
      .aggregate([
        { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
        { $sort: { totalBooks: -1 } },
        { $limit: 1 },
      ])
      .toArray();

  const groupByDecade = async () =>
    books
      .aggregate([
        {
          $addFields: {
            decade: {
              $concat: [
                {
                  $toString: {
                    $multiply: [
                      { $floor: { $divide: ["$published_year", 10] } },
                      10,
                    ],
                  },
                },
                "s",
              ],
            },
          },
        },
        { $group: { _id: "$decade", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

  // Task 5: Indexing
  const createTitleIndex = async () =>
    books.createIndex({ title: 1 }, { name: "idx_title_asc" });
  const createAuthorYearIndex = async () =>
    books.createIndex(
      { author: 1, published_year: -1 },
      { name: "idx_author_year" }
    );
  const explainTitleQuery = async () =>
    books.find({ title: "1984" }).explain("executionStats");

  // Run and print outputs
  console.log("Online mode: running queries against MongoDB");

  console.log("\nTask 2 - Basic CRUD:");
  console.log(
    "Find genre=Fiction ->",
    (await findByGenre("Fiction")).length,
    "docs"
  );
  console.log(
    "Find after year=1950 ->",
    (await findAfterYear(1950)).length,
    "docs"
  );
  console.log(
    "Find author=George Orwell ->",
    (await findByAuthor("George Orwell")).length,
    "docs"
  );
  await updatePrice("1984", 12.49);
  console.log("Updated price of 1984");
  await deleteByTitle("Non-Existing Title");
  console.log("Attempted delete by title (no-op if not found)");

  console.log("\nTask 3 - Advanced:");
  console.log("In stock after 2010 ->", await inStockAfter2010());
  console.log(
    "Projection (title, author, price) ->",
    await projectionExample()
  );
  console.log(
    "Sort price asc (first 3) ->",
    (await sortByPriceAsc()).slice(0, 3)
  );
  console.log(
    "Sort price desc (first 3) ->",
    (await sortByPriceDesc()).slice(0, 3)
  );
  console.log("Pagination page=1 ->", await paginate(1, 5));
  console.log("Pagination page=2 ->", await paginate(2, 5));

  console.log("\nTask 4 - Aggregations:");
  console.log("Average price by genre ->", await avgPriceByGenre());
  console.log("Author with most books ->", await authorWithMostBooks());
  console.log("Group by decade ->", await groupByDecade());

  console.log("\nTask 5 - Indexing:");
  console.log("Create index title ->", await createTitleIndex());
  console.log(
    "Create compound index author+published_year ->",
    await createAuthorYearIndex()
  );
  const explain = await explainTitleQuery();
  console.log("Explain plan for title search (1984) ->");
  console.dir(explain, { depth: null });

  await client.close();
}

async function runOffline() {
  console.log("Offline dry-run mode: simulating queries without a database");
  let docs = loadLocalBooks();

  // Task 2
  const findByGenre = (genre) => docs.filter((d) => d.genre === genre);
  const findAfterYear = (year) => docs.filter((d) => d.published_year > year);
  const findByAuthor = (author) => docs.filter((d) => d.author === author);
  const updatePrice = (title, newPrice) => {
    const idx = docs.findIndex((d) => d.title === title);
    if (idx >= 0) docs[idx].price = newPrice;
    return idx >= 0;
  };
  const deleteByTitle = (title) => {
    const before = docs.length;
    docs = docs.filter((d) => d.title !== title);
    return before - docs.length;
  };

  // Task 3
  const inStockAfter2010 = () =>
    docs.filter((d) => d.in_stock && d.published_year > 2010);
  const projectionExample = () =>
    docs.map((d) => project(d, { title: 1, author: 1, price: 1 }));
  const sortByPriceAsc = () => [...docs].sort((a, b) => a.price - b.price);
  const sortByPriceDesc = () => [...docs].sort((a, b) => b.price - a.price);
  const paginate = (page = 1, pageSize = 5) =>
    sortByPriceAsc().slice((page - 1) * pageSize, page * pageSize);

  // Task 4
  const avgPriceByGenre = () => {
    const map = new Map();
    for (const d of docs) {
      const k = d.genre;
      if (!map.has(k)) map.set(k, { sum: 0, count: 0 });
      const e = map.get(k);
      e.sum += d.price;
      e.count += 1;
    }
    return Array.from(map.entries()).map(([genre, { sum, count }]) => ({
      _id: genre,
      averagePrice: sum / count,
      count,
    }));
  };

  const authorWithMostBooks = () => {
    const map = new Map();
    for (const d of docs) map.set(d.author, (map.get(d.author) || 0) + 1);
    const arr = Array.from(map.entries()).map(([author, totalBooks]) => ({
      _id: author,
      totalBooks,
    }));
    arr.sort((a, b) => b.totalBooks - a.totalBooks);
    return arr.slice(0, 1);
  };

  const groupByDecade = () => {
    const map = new Map();
    for (const d of docs) {
      const decade = Math.floor(d.published_year / 10) * 10 + "s";
      map.set(decade, (map.get(decade) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([decade, count]) => ({ _id: decade, count }))
      .sort((a, b) => a._id.localeCompare(b._id));
  };

  // Task 5 (simulated)
  const createTitleIndex = () => "idx_title_asc (simulated)";
  const createAuthorYearIndex = () => "idx_author_year (simulated)";
  const explainTitleQuery = () => ({
    ok: 1,
    note: "This is a simulated explain plan. In real DB, use .explain('executionStats').",
  });

  console.log("\nTask 2 - Basic CRUD:");
  console.log("Find genre=Fiction ->", findByGenre("Fiction").length, "docs");
  console.log("Find after year=1950 ->", findAfterYear(1950).length, "docs");
  console.log(
    "Find author=George Orwell ->",
    findByAuthor("George Orwell").length,
    "docs"
  );
  updatePrice("1984", 12.49);
  console.log("Updated price of 1984 (simulated)");
  deleteByTitle("Non-Existing Title");
  console.log("Attempted delete by title (simulated)");

  console.log("\nTask 3 - Advanced:");
  console.log("In stock after 2010 ->", inStockAfter2010());
  console.log("Projection (title, author, price) ->", projectionExample());
  console.log("Sort price asc (first 3) ->", sortByPriceAsc().slice(0, 3));
  console.log("Sort price desc (first 3) ->", sortByPriceDesc().slice(0, 3));
  console.log("Pagination page=1 ->", paginate(1, 5));
  console.log("Pagination page=2 ->", paginate(2, 5));

  console.log("\nTask 4 - Aggregations:");
  console.log("Average price by genre ->", avgPriceByGenre());
  console.log("Author with most books ->", authorWithMostBooks());
  console.log("Group by decade ->", groupByDecade());

  console.log("\nTask 5 - Indexing:");
  console.log("Create index title ->", createTitleIndex());
  console.log(
    "Create compound index author+published_year ->",
    createAuthorYearIndex()
  );
  console.log("Explain plan for title search (1984) ->", explainTitleQuery());
}

(async () => {
  try {
    if (NO_DB) {
      await runOffline();
    } else {
      await runOnline();
    }
  } catch (err) {
    console.error("Error running queries:", err);
    if (!NO_DB) {
      console.error(
        "Tip: If you cannot use MongoDB on this machine, re-run with NO_DB=1 to use offline mode."
      );
    }
    process.exitCode = 1;
  }
})();
