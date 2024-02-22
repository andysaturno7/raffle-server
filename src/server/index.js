"use strict"

import http from 'http';
import express, { json } from 'express';
import cors from 'cors';

import * as zoomRoutes from '../zoom/zoom.routes.js';

export class Server {

    /**
     * @type {number}
     */
    port = 3000;
    
    app;
    /**@type {http.Server} */
    server;

    /**
    * @param {number} port    
    */
    constructor(port){
        this.port = port;
        this.app = express();
        this.setMidlewares();
        this.setRoutes();
        this.server = new http.createServer(this.app);
    }

    start(){
        return this.server.listen(this.port)
    }


    setMidlewares(){
        this.app.use(cors());
        this.app.use(json());
    }

    setRoutes(){
        this.app.use('/api/zoom', zoomRoutes.router);
        // this.app.use(express.static(__dirname+'./public'));
    }

}