# Hackathon-team10
SA Hackathon - Team 10 

# Details

**Project** : "Realtime Alert Command Control System"
**Team Number** : 10  
**Team Name** : 'Space Force'
**Demonstration Video** : _Insert link to demonstration video_  

# Overview

NATO Alliance Countries are building an Alarm System for monitoring Ukraine coastline  and flagging the status of the Black Sea Coast line by sending alert flags (Red, Blue, Green )to the Ukrainian forces.

The idea for building a Dashboard is simple . NATO alliance countries are aggregating all the images of the coast of Black Sea collected via satellites and surveillance aircrafts. These Images will be processed through an image processing tool called VOXEL51 . This tool will generate metadata based on the images, detecting the vessels and predicting the kind/category of vessel . For example these vessels could be Commercial Cargos, Commercial Oil Tankers or Warships, Frigates Destroyers  or aircraft carriers. 

All these images are collected constantly and metadata data that is generated via  VOXEL51  is merged/loaded to the Mongo Atlas Database. 

As the Data gets loaded  to a mongo Collections it is constantly indexed using Atlas Search to make this data searchable. The Search supports fuzzy logic , synonyms as different Assets (as in Ships ) may have different names in different countries 

Atlas charts will use this real time data to update the dashboard for constant monitoring . A pie chart can report the percentage of non-military vessels vs commercial vessels vs humanitarian vessels like red cross  or peace corps.

Chart will also have a Heat Map of Ukraine’s Black Sea coast line highlighting military activity.

For building this dashboard for the Command Control Center  Nato Alliance Countries have selected a set of tools.

- VOXEL51  for AI  processing and metadata generation  
- MongoDB Atlas 
- Atlas Search
- Atlas Charts.

VOXEL51 has leveraged the power of the MongoDB database to help develpoers and data scientists build and optimize object detection and classification algorithms


# Justification

_Please explain why you decided to build the application/demonstration for this project. What inspired you? What problems does it solve or how will it make Presales activities easier?_



MongoDB Competitive differentiators
- Developer Velocity
- Native GeoJSON capablity
- Integrated Atlas Search 
- Integrated Charts



# Detailed Application Overview

Architecture:

![This is an Architecture Diagram ](../images/Architecture.png)
MongoDB components/products used:

- MongoDB Atlas
- MongoDB Atlas Search 
- MongoDB Atlas Charts
- MongoDB Atlas Triggers

Workings:
1. Satellite Images collection
2. Real Time processing of images  via VOXEL51 to metadata. 
3. Ingest data using 
4. Aggregate and modify the Data.
5. Index using Atlas search for Quick search 
6. Atlas Search w/ synonyms with user interface
7. Setup Trigger Warning upon threat detection 
8. Build Command Control Dashboard for Monitoring.



# Roles and Responsibilities

Charlie Little : Data Model , Dataset Generation
Dhananjay Ghevde : Demo Story Line, Aggregation Pipeline, Git Hub 
Cassiano Bien : Search 
Alec : Charts , Dashboard
Sharath :  Video 

# Demonstration Script

* _setup/installation steps_

Fifty One  Setup Instations:

If you have a Apple computer and doesn't have Apple Command Line Tools installed, run this command:
```
xcode-select --install
```
Install Python virtualenv:
```
brew install virtualenv
```

````
virtualenv venv
source venv/bin/activate
````

Install Fiftyone by running these commmads: 
```
pip install --upgrade pip setuptools wheel
pip install fiftyone
```
* _step by step instructions on how to give the demonstration_
**
* _key points to emphasize at each point in the demonstration_
* _any tear down steps required to reset the demonstration so it is ready for the next time_


==================================Template ends here ======================================


Object detection algortihms are being used for many real-world use cases. Real-time detection allows all kinds of challenges for collecting and acting on opportunities and threats.




Resources:
https://voxel51.com/docs/fiftyone/index.html

https://cloud.mongodb.com/v2/622fa89e695aa705f173de8f#clusters


