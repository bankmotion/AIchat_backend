import express from "express"

import  {createChatbyCharacterId, getChatbyId, createChatMessagebyChatId, updateChatMessagebyMessageId, deleteNoMainChatMessagebyChatId}  from "../controllers/chatController"


const router = express.Router();

router.post('/', createChatbyCharacterId)
router.get('/:Id', getChatbyId)
router.post('/:chatId/messages', createChatMessagebyChatId)
router.patch('/:chatId/messages/:messageId', updateChatMessagebyMessageId)
router.delete('/:chatId/messages',deleteNoMainChatMessagebyChatId)

export default router