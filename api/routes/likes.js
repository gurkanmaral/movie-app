import express from "express"
import { getLikes,addLike,deleteLike,likeCount, getLikedMovies, getLikedSeries } from "../controllers/like.js"

const router = express.Router()

router.get("/",getLikes)
router.post("/",addLike)
router.delete("/",deleteLike)
router.get("/count",likeCount)
router.get("/movies/:userId", getLikedMovies)
router.get("/series/:userId", getLikedSeries)
export default router