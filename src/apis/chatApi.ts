import express from "express"

import  {createChatbyCharacterId, getChatbyId}  from "../controllers/chatController"


const router = express.Router();

router.post('/', createChatbyCharacterId)
router.get('/:Id', getChatbyId)

export default router