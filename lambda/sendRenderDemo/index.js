import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { connect } from './db.js'; // Your MongoDB connection module
import { ObjectId } from 'mongodb';
import axios from 'axios';

const s3Client = new S3Client({ region: "us-east-1" });

const testEvent = {
    Records: [
        {
            s3: {
                bucket: {
                    name: "twyne-renders",
                },
                object: {
                    key: "65a59778e91d4c46ebf40ed5/final_65a59778e91d4c46ebf40ed5.mp4",
                },
            },
        },
    ],
};

const handler = async (event) => {
    console.log("Connecting to MongoDB...");
    const db = await connect(); // Connect to MongoDB
    console.log("Connected to MongoDB.");

    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        // Parse out the base name from the key
        const baseName = key.split('/').pop().replace('final_', '').split('.mp4')[0];

        if (!baseName) {
            console.log("Invalid file name format:", key);
            continue;
        }

        console.log("Extracted baseName:", baseName);

        try {
            // Find the matching document in the 'storylines' collection
            const collection = db.collection('storylines');
            const storyline = await collection.findOne({ _id: new ObjectId(baseName) });

            if (storyline) {
                console.log("Match found, sending data to API...");

                const apiResponse = await axios.post(`${process.env.API_BASE_URL}/v1/finalRender:${storyline._id}`, {
                    // Include relevant data here
                    // For example, S3 file URL or any other necessary information
                });

                console.log("Data sent to API successfully:", apiResponse.data);
            } else {
                console.log("No matching storyline found for baseName:", baseName);
            }
        } catch (error) {
            console.error("Error in processing:", error);
            throw error;
        }
    }
};

handler(testEvent);