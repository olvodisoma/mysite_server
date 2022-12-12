import express from "express";
import {books} from "../controllers/admin.js"

export const adminRouter=express.Router();

adminRouter.route('/books').get(books);
