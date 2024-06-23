// cannister code goes here
import {v4 as uuidv4} from 'uuid'; // Used to generate uuid for messages
import { Server, StableBTreeMap, ic } from 'azle'; //
import express from 'express';

/**
 * Message Class - used to create all message objects
 */
class Message {
    id: string;
    title: string;
    body: string;
    attachmentURL: string;
    createdAt: Date;
    updatedAt: Date;
}

// Message Storage
const messageStorage = StableBTreeMap<string, Message>(0);

export default Server(() => {
    const app = express();
    app.use(express.json);

    return app.listen();
});


