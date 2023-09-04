import express from "express"

import { getRating,addRating,updateRating, deleteRating, getFriendsRatings } from "../controllers/rating.js"

const router = express.Router()


router.get("/",getRating)
router.post("/",addRating)
router.delete("/",deleteRating)
router.get("/follow",getFriendsRatings)


export default router