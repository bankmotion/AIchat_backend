import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync'; // Adjust the import path accordingly
import { getCharactersData } from '../services/characterService';

interface QueryParams {
    page?: string;   // Optional, since it might not be present
    search?: string; // Optional
    mode?: string;   // Optional
    sort?: string;   // Optional
    tag_id?:string;
    tag_name?:string;
}

// Define the getUserData function
export const getCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
        const { page, search, mode, sort, tag_id, tag_name }: QueryParams = req.query as QueryParams;
        const result = await getCharactersData({ page, search, mode, sort, tag_id, tag_name });
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

export const createCharacterData = catchAsync(async (req: Request, res: Response) => {
    try {
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching character data' });
    }
})

module.exports = {
    getCharacterData,
    createCharacterData,
}