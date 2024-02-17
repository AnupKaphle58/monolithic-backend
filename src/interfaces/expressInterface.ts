import {Request} from "express";
import { UserInterface } from ".";

export interface UserRequestInterface extends Request {
    user?: UserInterface
}