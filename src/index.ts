// cannister code goes here
import {v4 as uuidv4} from 'uuid'; // Used to generate uuid for messages
import { Server, StableBTreeMap, ic, update } from 'azle'; //
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

    // ENDPOINTS

    // Creating a new message
    app.post('/messages', (req, res) => {
        const message: Message = {id: uuidv4(), createdAt: getCurrentDate(), ...req.body};
        messageStorage.insert(message.id, message);
        res.json(message);
    });

    // Get all messages
    app.get('/messages', (rep, res) => {
        res.json(messageStorage.values())
    });

    // Get message by id
    app.get('/messages/:id', (req, res) => {
        const messageId = req.params.id;
        /**
         * The get method returns an Opt type, which
         * represents the possibility of a value being
         * present (Some) or absent (None).
         */
        const messageOpt = messageStorage.get(messageId);
        if ("None" in messageOpt) {
            res.status(404).send(`the messages with id ${messageId} not found`);
        } else {
            res.json(messageOpt.Some);
        }
    });

    // Updating a message
    app.put('/messages/:id', (req, res) => {
        const messageId = req.params.id;
        const messageOpt = messageStorage.get(messageId);
        if ("None" in messageOpt) {
            res.status(404).send(`update failed. message with id ${messageId} not found`);
        } else {
            const message = messageOpt.Some;
            const updatedMessage = {...message, ...req.body, updatedAt: getCurrentDate()};
            messageStorage.insert(message.id, updatedMessage);
            res.json(updatedMessage);
        }
    });

    // Delete a message
    app.delete('/messages/:id', (req, res) => {
        const messageId = req.params.id;
        const deletedMessage = messageStorage.remove(messageId);
        if ("None" in deletedMessage) {
            res.status(404).send(`update failed. message with id ${messageId} not found`);
        } else {
            res.json(deletedMessage.Some)
        }

    })


    return app.listen();
});

function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000000);
}


