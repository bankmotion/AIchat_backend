import express from "express"

import  {getCharacterData, createCharacterData}  from "../controllers/characterController"


const router = express.Router();

router.get('/', getCharacterData)
router.post('/', createCharacterData)

export default router