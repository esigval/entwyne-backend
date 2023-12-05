// The Function of this storyline route is to draw a storyline template from the database, and then use that template to generate a new storyline.
// The storyline will serve two functions, 1) to provide a template for the user to follow, and 2) to provide a template for the AI to follow to create prompts.
// Create DB entry that stores the story instance
// Use Template to Create Instance
// Use Instance to Create Prompt for Twynes ()

// 

// I want to connect to my mobgoDB database and pull a storyline template from the database

const { MongoClient } = require('mongodb');



const getOrderedVideoPaths = require("../utils/getOrderedVideoPaths")


// Design the Storyline Template schema:
properties:

Id
TemplateName
storylineTemplateContainerId
    - defaultPrompt
    - storylineOrder // This is the order of the storyline in the container
mediaType
lengthDefault


// Design the Storyline Instance schema:

properties:

Id
Name
templateId
mediacotainerId
 - twyneId
 - promptId
length

// Design the twyneMedia schema

id int AI PK 
filename varchar(255) 
webmfilepath varchar(255) 
transcription text 
sentiment varchar(255) 
beattag varchar(255) 
audio varchar(255) 
transcriptionurl text
storyInstance_templateId
promptId

// Design the prompt schema

id int AI PK
prompt text
twyneId 
promptInboundLink





