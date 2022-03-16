import pymongo

client = pymongo.MongoClient("mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority")
db = client.fiftyone
collection = db.ships

print("--- CREATING NEW COLLECTION WITH AGG ---")
result = collection.aggregate([
    {
        '$addFields': {
            'ground_truth.detections.source_file': '$filepath',
            'ground_truth.detections.meta_data': '$metadata',
            'ground_truth.detections.tags': '$tags'
        }
    }, {
        '$project': {
            'ground_truth.detections': 1,
            '_id': 0
        }
    }, {
        '$unwind': {
            'path': '$ground_truth.detections'
        }
    }, {
        '$out': 'ships_updated'
    }
])
print(result)

print("--- UPDATING MIL FLAG ---")
db.ships_updated.updateMany({'ground_truth.detections.label': {'$in': [ 'Other Warship','Other Destoryer','Other Frigate','Nimitz', 'Submarine']}},{"$set":{"mil_flag":True}})
