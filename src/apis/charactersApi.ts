import express from "express"

import { getData } from "../controllers/characterController"

const router = express.Router();

router.get('/', getData)

export default router