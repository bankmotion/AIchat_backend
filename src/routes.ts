import express from "express"

import characterApi from "./apis/charactersApi"
import tagApi from "./apis/tagApi"
import profileApi from "./apis/profileApi"
import reviewsApi from "./apis/reviewsApi"
import chatApi from "./apis/chatApi"

const router = express.Router()

router.use('/characters', characterApi)
router.use('/tags', tagApi)
router.use('/profiles', profileApi)
router.use('/reviews', reviewsApi)
router.use('/chats', chatApi)

export default router