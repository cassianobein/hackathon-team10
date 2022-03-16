import os

#config defaults (or place these in ~/.fiftyone/config.json)
# os.environ['FIFTYONE_DATABASE_URI'] = 'mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority'
# os.environ['FIFTYONE_DATABASE_VALIDATION'] = "false"

import fiftyone as fo
import fiftyone.zoo as foz

fo.config.dataset_zoo_dir =     "./datasets"
fo.config.default_dataset_dir = "./datasets"

from datetime import *

t = datetime.today()

dataset_name = "ships-%s%s" % (t.hour, t.minute)
dataset_dir = fo.get_default_dataset_dir( dataset_name )

print( dataset_dir )
print( "=========> BEFORE <===========" )
print( fo.config )

# Load VOC formatted dataset
dataset_dir = "../ShipRSImageNet/archive/ShipRSImageNet_V1/VOC_Format"

data_path = dataset_dir + "/JPEGImages"
labels_path = dataset_dir + "/Annotations"

# Import dataset by explicitly providing paths to the source media and labels
dataset = fo.Dataset.from_dir(
    dataset_type=fo.types.VOCDetectionDataset,
    data_path=data_path,
    labels_path=labels_path,
    name=dataset_name,
)

# View summary info about the dataset
print(dataset)

# Print the first few samples in the dataset
print(dataset.head())
# Verify that the class list for our dataset was imported
# print(coco_dataset.default_classes)  # ['airplane', 'apple', ...]
import torch
import torchvision

# Run the model on GPU if it is available
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Load a pre-trained Faster R-CNN model
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=False)
model.to(device)
model.eval()

print("Model ready")
# Choose a random subset of 100 samples to add predictions to
predictions_view = dataset.take(100, seed=51)

from PIL import Image
from torchvision.transforms import functional as func

import fiftyone as fo

# Get class list
classes = dataset.default_classes

# Add predictions to samples
with fo.ProgressBar() as pb:
    for sample in pb(predictions_view):
        # Load image
        image = Image.open(sample.filepath)
        image = func.to_tensor(image).to(device)
        c, h, w = image.shape

        # Perform inference
        preds = model([image])[0]
        labels = preds["labels"].cpu().detach().numpy()
        scores = preds["scores"].cpu().detach().numpy()
        boxes = preds["boxes"].cpu().detach().numpy()

        # Convert detections to FiftyOne format
        detections = []
        for label, score, box in zip(labels, scores, boxes):
            # Convert to [top-left-x, top-left-y, width, height]
            # in relative coordinates in [0, 1] x [0, 1]
            x1, y1, x2, y2 = box
            rel_box = [x1 / w, y1 / h, (x2 - x1) / w, (y2 - y1) / h]

            label = classes[label] if( len(classes) > 0  ) else None
            detections.append(
                fo.Detection(
                    label=label,
                    bounding_box=rel_box,
                    confidence=score
                )
            )

        # Save predictions to dataset
        sample["predictions"] = fo.Detections(detections=detections)
        sample.save()

dataset.persistent = True
dataset.save()

# print( "=========> AFTER <===========" )
# print( fo.config )

# dataset = foz.load_zoo_dataset( dataset_name, cleanup=False )
session = fo.launch_app(dataset)

# block until app is closed
session.wait( 3 )
