import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { creatingChatData, gettingChatData } from '../services/chatService';

export const createChatbyCharacterId = catchAsync(async (req: Request, res: Response) => {
    try {
        const characterId = req.body.character_id
        console.log(characterId,"characterId")
        const result = await creatingChatData(characterId);
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

module.exports = {createChatbyCharacterId, getChatbyId}
