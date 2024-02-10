import "module-alias/register";

import cors from "cors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import http, { IncomingMessage } from "http";

import { Database, corsWhitelist, port } from "@src/config";
import { ProxyRouter } from "@src/routes/v1/";
import * as errorHandler from "@src/middlewares/errorHandler";
import { UserInterface } from "./interfaces";
import { Guard } from "./middlewares";

class Server {
    app: express.Application;
    constructor() {
        this.app = express();
        this.configuration();
    }

    private configuration() {
        this.app.set("port", port);
        this.app.use(cors(this.corsOptions));
        this.app.use(express.json());
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // API Routes
        this.app.use("/app/api/v1", ProxyRouter.map());

        //Error Handler
        this.app.use(errorHandler.genericErrorHandler);
        this.app.use(errorHandler.methodNotAllowed);
        this.app.use(errorHandler.notFound);
    }

    private async connectDB() {
        try {
            await Database.connection();
        } catch (error: any) {
            throw new Error(error);
        }
    }

    private corsOptions: cors.CorsOptions = {
        origin: function (origin, callback) {
            if (!origin || corsWhitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        optionsSuccessStatus: 200,
        credentials: true,
    };

    public start() {
        this.connectDB();
        this.app.use(
            async function (req, res, next) {
                const token = req.headers.authorization as string;
                const secret = req.headers?.["x-workspace-secret-id"] as string;
                const clientIp = req.headers?.['x-request-ip'] as string;
                const deviceId = req.headers?.['x-device-id'] as string;
                const browser = req.headers?.['sec-ch-ua'] as string;
                const isMobile = req.headers?.['sec-ch-ua-mobile'] as string;
                const platform = req.headers?.['sec-ch-ua-platform'] as string;

                let user: UserInterface | undefined;

                if (token) {
                    user = await Guard.auth(token.replace("Bearer ", ""));
                }

                next();
            })
        this.app.listen(this.app.get("port"), () =>
            console.info(`App running on PORT ${this.app.get("port")}`)
        );
    }
}

const server = new Server();
server.start();
