import fiftyone as fo
import fiftyone.zoo as foz

#config defaults (or place these in ~/.fiftyone/config.json)
fo.config.database_uri =        "mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority"
fo.config.database_validation = False
fo.config.dataset_zoo_dir =     "./datasets"
fo.config.default_dataset_dir = "./datasets"

dataset_name = "coco-2017"
dataset_dir = fo.get_default_dataset_dir( dataset_name )
print( dataset_dir )
dataset = foz.load_zoo_dataset(
    dataset_name,
    split="validation",
    max_samples=5000,
    cleanup=False
)

# dataset = foz.load_zoo_dataset( dataset_name, cleanup=False )
session = fo.launch_app(dataset)

# block until app is closed
session.wait( 3 )
