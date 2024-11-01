import express from "express"

import  {getMyProfileData,updateMyProfileData, getProfileDataById, getMyBlockList}  from "../controllers/profileController"


const router = express.Router();

router.post('/mine', getMyProfileData)
router.patch('/mine',updateMyProfileData)
router.get('/:profileId',getProfileDataById)
router.get('/mine/blocked/', getMyBlockList)

export default router