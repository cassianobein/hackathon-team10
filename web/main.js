const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const { request } = require("express");

const client = new MongoClient("mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority");
const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(Cors());

var collection;

server.get("/search", async (request, response) => {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "index": "autocomplete",
                    "autocomplete": {
                        "query": `${request.query.query}`,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});
server.get("/get/:id", async (request, response) => {
    try {
        let result = await collection.findOne({ "_id": ObjectID(request.params.id) });
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("food").collection("recipes");
    } catch (e) {
        console.error(e);
    }
});