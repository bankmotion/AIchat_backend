import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync'; // Adjust the import path accordingly
import { getCharactersAllData, creatingCharacterData, getCharacterDataById, updateCharacterDataById, deleteCharacterDataById, gettingSimilarCharacters } from '../services/characterService';

interface QueryParams {
    page?: string;   // Optional, since it might not be present
    search?: string; // Optional
    mode?: string;   // Optional
    sort?: string;   // Optional
    tag_id?: string;  // Optional
    tag_name?: string; // Optional
    is_nsfw?: string;
}

// Define the getUserData function
export const getCharactersData = catchAsync(async (req: Request, res: Response) => {
    try {
        const { page, search, mode, sort, tag_id, tag_name, is_nsfw }: QueryParams = req.query as QueryParams;
        const result = await getCharactersAllData({ page, search, mode, sort, tag_id, tag_name, is_nsfw });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

export const createCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
        const params = req.body
        const result = await creatingCharacterData(params);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating character data' });
    }
})

export const getCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const result = await getCharacterDataById(characterId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

export const updateCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
        const params = req.body
        const characterId = req.params.characterId;
        const result = await updateCharacterDataById({ params, characterId });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

export const deleteCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const result = await deleteCharacterDataById(characterId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

export const getSimilarCharacters = catchAsync(async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const { isNsfw } = req.query;
        const result = await gettingSimilarCharacters(characterId, isNsfw);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching character data' });
    }
});


module.exports = {
    getCharactersData,
    createCharacterData,
    getCharacterData,
    updateCharacterData,
    deleteCharacterData,
    getSimilarCharacters
}