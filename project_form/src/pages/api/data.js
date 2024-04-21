import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  await client.connect();
  return client.db("Dhrumil_Portfolio"); // Your database name
}

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const collection = db.collection("portfolio_work_data");

  switch (req.method) {
    case "GET":
      try {
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
      } catch (e) {
        res.status(500).json({ error: "Failed to fetch data" });
      }
      break;

    case "POST":
      try {
        const entry = req.body;
        // Validate entry or sanitize data here if necessary

        const result = await collection.insertOne(entry);

        // Check if the insert operation was acknowledged
        if (!result.acknowledged) {
          console.error("Insert operation failed to be acknowledged.");
          return res
            .status(500)
            .json({ error: "Data insertion was not acknowledged." });
        }

        // Adjusted to use insertedId
        const insertedDocument = await collection.findOne({
          _id: result.insertedId,
        });
        if (!insertedDocument) {
          return res
            .status(500)
            .json({ error: "Failed to retrieve inserted document." });
        }

        // Ensure the success response is correctly sent
        return res
          .status(201)
          .json({
            message: "Data inserted successfully",
            data: insertedDocument,
          });
      } catch (e) {
        console.error("Failed to insert data: ", e);

        // Check for MongoDB specific errors that can be handled differently
        if (e.name === "MongoServerError") {
          // Handle specific MongoDB server errors, e.g., duplicate key error
          return res
            .status(400)
            .json({ error: "MongoDB server error", details: e.message });
        }

        // For unexpected errors, return a generic 500 error
        return res
          .status(500)
          .json({ error: "Failed to insert data", details: e.message });
      }

      break;

    case "PATCH":
      try {
        const { _id, ...updateData } = req.body;

        // Ensure _id is provided
        if (!_id) {
          return res
            .status(400)
            .json({ error: "Missing document _id for update" });
        }

        // Ensure there is data to update
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: "No update data provided" });
        }

        const result = await collection.updateOne(
          { _id: new ObjectId(_id) }, // Ensure 'new' is used with ObjectId
          { $set: updateData }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ error: "Document not found or no change made" });
        }

        res.status(200).json({ message: "Document updated successfully" });
      } catch (e) {
        console.error("Patch operation failed: ", e);
        res
          .status(500)
          .json({ error: "Failed to update data", details: e.message });
      }
      break;

    case "DELETE":
      try {
        const { _id } = req.body;
        if (!_id) {
          return res.status(400).json({ error: "Document _id required" });
        }
        const result = await collection.deleteOne({ _id: new ObjectId(_id) }); // Corrected line
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json({ message: "Document deleted", _id: _id });
      } catch (e) {
        console.error("Delete operation failed: ", e);
        res
          .status(500)
          .json({ error: "Failed to delete data", details: e.toString() });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Ensure to close the database connection
  await client.close();
}
