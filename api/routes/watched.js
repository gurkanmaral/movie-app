import express from "express"
import { getWatched,addWatched,deleteWatched,countFilms, getWatchedMovies, getWatchedSeries} from "../controllers/watched.js"

const router = express.Router()

router.get("/",getWatched)
router.post("/",addWatched)
router.delete("/",deleteWatched)
router.get("/count", countFilms);
router.get("/movies/:userId", getWatchedMovies);
router.get("/series/:userId",getWatchedSeries)


export default router