import { Server } from "./server/index.js";

const PORT = process.env.PORT || 3000;

const server = new Server(PORT);

server.start().once("listening", ()=>{
    console.log("server listening... on port: "+PORT);
})