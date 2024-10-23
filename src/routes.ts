import express from "express"

import characterApi from "./apis/charactersApi"
import tagApi from "./apis/tagApi"

const router = express.Router()

router.use('/characters', characterApi)
router.use('/tags', tagApi)

export default router