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
                '$search': {
                    'index': 'autocomplete', 
                    'autocomplete': {
                        'query': `${request.query.query}`, 
                        'path': 'ground_truth.detections.label',
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 2
                        }
                    }
                }
            }, {
                '$group': {
                    '_id': '$ground_truth.detections.label', 
                    'count': {
                        '$sum': 1
                    }
                }
            }
            , {
                '$limit': 20
            }

        ]).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});
server.get("/get/:id", async (request, response) => {
    try {
        //let result = await collection.findOne({ "_id": ObjectID(request.params.id) });
        let result = await collection.find({ "ground_truth.detections.label": request.params.id }).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("fiftyone").collection("ships_updated");
    } catch (e) {
        console.error(e);
    }
});