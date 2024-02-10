import { NextFunction, Request, Response } from "express";
import * as fs from "fs";

const createDirectory = (req: Request, res: Response, next: NextFunction) => {
    const path = "./public";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    next();
};

export default createDirectory;
