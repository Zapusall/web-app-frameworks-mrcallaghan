("use strict");

/**********************************************************
 * MongoDB
 **********************************************************/

const { MongoClient } = require("mongodb");

const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db("sample_guides");
    const collection = db.collection("planets");

    const cursor = collection.find({
      mainAtmosphere: "H2",
      orderFromSun: { $gt: 3 },
    });

    const planets = await cursor.toArray();
    console.log(planets);
    planets.sort((a, b) => {
      if (a.orderFromSun < b.orderFromSun) {
        return -1;
      }
      return 1;
    });

    const planetStrings = planets.map(
      (planet) =>
        `<b>${planet.name}</b>: <br />main atmosphere: ${planet.mainAtmosphere} <br />mean surface temperature (degrees C): ${planet.surfaceTemperatureC.mean} <br />`
    );

    console.log("<ul>");
    planetStrings.forEach((planetString) =>
      console.log(`<li>${planetString}</li>`)
    );

    console.log("</ul>");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

async function printAll(cursor) {
  while (await cursor.hasNext()) {
    console.log(await cursor.next());
  }
}
