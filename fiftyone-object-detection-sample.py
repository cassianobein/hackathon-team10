import os
#config defaults (or place these in ~/.fiftyone/config.json)
os.environ['FIFTYONE_DATABASE_URI'] = 'mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority'
os.environ['FIFTYONE_DATABASE_VALIDATION'] = "false"

import fiftyone as fo
import fiftyone.zoo as foz
#
from PIL import Image
import torch
import torchvision
from torchvision.transforms import functional as func
#

# Run the model on GPU if it is available
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Load a pre-trained Faster R-CNN model
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
model.to(device)
model.eval()

print("Model ready")
# fo.config.database_uri =        "mongodb+srv://main_user:musermuser@team10.3b42v.mongodb.net/fiftyone?retryWrites=true&w=majority"
# fo.config.database_validation = False
fo.config.dataset_zoo_dir =     "./datasets"
fo.config.default_dataset_dir = "./datasets"

dataset_name = "coco-2017"

dataset = foz.load_zoo_dataset("coco-2017", split="validation", max_samples=500 )
dataset.persistent = True
predictions_view = dataset.take(1)

# Get class list
classes = dataset.default_classes
#
# Add predictions to samples
with fo.ProgressBar() as pb:
    for sample in pb(predictions_view):
        # Load image
        image = Image.open(sample.filepath)
        image = func.to_tensor(image).to(device)
        c, h, w = image.shape
        #
        # Perform inference
        preds = model([image])[0]
        labels = preds["labels"].cpu().detach().numpy()
        scores = preds["scores"].cpu().detach().numpy()
        boxes = preds["boxes"].cpu().detach().numpy()
        #
        # Convert detections to FiftyOne format
        detections = []
        for label, score, box in zip(labels, scores, boxes):
            # Convert to [top-left-x, top-left-y, width, height]
            # in relative coordinates in [0, 1] x [0, 1]
            x1, y1, x2, y2 = box
            rel_box = [x1 / w, y1 / h, (x2 - x1) / w, (y2 - y1) / h]
            #
            detections.append(
                fo.Detection(
                    label=classes[label],
                    bounding_box=rel_box,
                    confidence=score
                )
            )
        #
        # Save predictions to dataset
        sample["faster_rcnn"] = fo.Detections(detections=detections)
        sample.save()

print("Finished adding predictions")
