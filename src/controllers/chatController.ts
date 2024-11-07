import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { creatingChatData, gettingChatData, creatingChatMessagebyChatId, updatingChatMessagebyMessageId, deletingNoMainChatMessagebyChatId } from '../services/chatService';

export const createChatbyCharacterId = catchAsync(async (req: Request, res: Response) => {
    try {
        const characterId = req.body.character_id;
        const profileId = req.body.profile_id;
        console.log(characterId,"characterId")
        const result = await creatingChatData(characterId, profileId);
        res.status(200).json(result);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating chat data' });
    }
})

export const getChatbyId = catchAsync(async (req: Request, res: Response) => {
    try {
        const chatId = req.params.Id
        console.log(chatId,"chatId")
        const result = await gettingChatData(chatId);
        res.status(200).json(result);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching chat data' });
    }
})


export const createChatMessagebyChatId = catchAsync(async (req: Request, res: Response) => {
    try {
        const params = req.body;
        const chatId = req.params.chatId;
        console.log(req.body,req.params,"create message")
        const result = await creatingChatMessagebyChatId(params, chatId);
        console.log(result)
        res.status(200).json(result);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating chat data' });
    }
})

export const updateChatMessagebyMessageId = catchAsync(async (req: Request, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const messageId = req.params.messageId;
        const is_main = req.body.is_main;
        const result = await updatingChatMessagebyMessageId(is_main, chatId, messageId);
        console.log(result)
        res.status(200).json(result);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating chat message data' });
    }
})

export const deleteNoMainChatMessagebyChatId = catchAsync(async (req: Request, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const messageIds = req.body.message_ids;
        console.log(messageIds,"messageIds",typeof(messageIds))
        const result = await deletingNoMainChatMessagebyChatId(chatId, messageIds);
        console.log(result)
        res.status(200).json(result);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting chat message data' });
    }
})

module.exports = {createChatbyCharacterId, getChatbyId, createChatMessagebyChatId, updateChatMessagebyMessageId, deleteNoMainChatMessagebyChatId}
