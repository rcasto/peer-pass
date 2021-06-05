/**
 * 2 separate cloud functions
 * 
 * 1 to create a room for peers to connect to each other
 * 1 to connect to an already created room
 * 
 * What happens when you create a room? What is required to create a room?
 * - To create a room, you must give it a name
 * - You can optionally give it a password/code for entry
 * - You must submit an initial offer sdp to get started
 * - (Maybe) A third party peer can also submit an offer to an existing room if they explicitly specify
 * 
 * How do multiple peers connect to a single room?
 * - A connecting peer specifies which room they want to connect to
 * - They must also provide the correct password/code if one is specified for the room
 * - An offer should always be available for an active room
 */
const { createRoom } = require('./functions/createRoom');
const { connectToRoom } = require('./functions/connectToRoom');

exports = {
    createRoom,
    connectToRoom,
};