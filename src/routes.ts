import express from "express"

import characterApi from "./apis/charactersApi"

const router = express.Router()

router.use('/characters', characterApi)

export default router