import express from "express"

import  {getMyProfileData,updateMyProfileData, getProfileDataById, getMyBlockList, reactivateMyProfileData}  from "../controllers/profileController"


const router = express.Router();

router.post('/mine', getMyProfileData)
router.patch('/mine',updateMyProfileData)
router.get('/:profileId',getProfileDataById)
router.get('/mine/blocked/', getMyBlockList)
router.post('/mine/reactivate',reactivateMyProfileData)

export default router