const { MongoClient } = require("mongodb");

// Replace the following string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://<user>:<password>@<cluster-url>?writeConcern=majority";
const client = new MongoClient(uri);

async function proximity(theaters) {
  // start proximity geo example
  const query = {
    "location.geo": {
      $near: {
        $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
        $maxDistance: 10000,
      },
    },
  };

  // find documents based on our query
  const cursor = theaters.find(query);
  // end proximity geo example

  // print a message if no documents were found
  if ((await cursor.count()) == 0) {
    console.log("No documents found!");
  }
  await cursor.forEach(console.dir);
}

async function range(theaters) {
  // start range geo example
  const query = {
    "location.geo": {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-72, 40],
              [-74, 41],
              [-72, 39],
              [-72, 40],
            ],
          ],
        },
      },
    },
  };

  // find documents based on our query
  const cursor = theaters.find(query);
  // end range geo example

  // print a message if no documents were found
  if ((await cursor.count()) === 0) {
    console.log("No documents found!");
  }
  await cursor.forEach(console.dir);
}

async function run() {
  try {
    const database = client.db("sample_mflix");
    const theaters = database.collection("theaters");

    await proximity(theaters);
    await range(theaters);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
