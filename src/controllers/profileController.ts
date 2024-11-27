import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync'; // Adjust the import path accordingly
import { getProfileData, updateProfileData, getProfileDataByProfileId, getMyBlockListById, reactivateProfileData } from '../services/profileService';

// Define the getTagData function
export const getMyProfileData = catchAsync(async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        console.log(id, "id")
        const result = await getProfileData();
        console.log(result, "result")
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching character data' });
    }
});

// Define the updateMyProfileData function
export const updateMyProfileData = catchAsync(async (req: Request, res: Response) => {
    try {
        const params = req.body;  // Use req.body to capture profile fields
        console.log(params, "params");

        // Call updateProfileData without redeclaring types
        const result = await updateProfileData(params);

        console.log(result, "result");
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile data' });
    }
});

export const getProfileDataById = catchAsync(async (req: Request, res: Response) => {
    try {
        const { profileId } = req.params;
        console.log(profileId, "profileid")
        const result = await getProfileDataByProfileId(profileId);
        console.log(result, "result")
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile data by profile id' });
    }
})

export const getMyBlockList = catchAsync(async (req: Request, res: Response) => {
    try {
        const profileId = req.query.id as string;
        if (!profileId) {
            return res.status(400).json({ message: "Profile ID is required" });
        }
        const result = await getMyBlockListById(profileId);
        console.log(result, "result")
        res.status(200).json(result.block_list);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blocklists data by profile id' });
    }
})

export const reactivateMyProfileData = catchAsync(async (req: Request, res: Response) => {
    try {
        const {user_email} =  req.body;  // Use req.body to capture profile fields
        console.log(user_email, "user_email");

        // Call updateProfileData without redeclaring types
        const result = await reactivateProfileData(user_email);

        console.log(result, "result");
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile data' });
    }
});


module.exports = {
    getMyProfileData,
    updateMyProfileData,
    getProfileDataById,
    getMyBlockList,
    reactivateMyProfileData
}