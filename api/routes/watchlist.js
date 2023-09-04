import express from "express"
import { getWatchlist,addWatchlist,deleteWatchlist, countWatchlist, getWatchlistMovies, getWatchlistSeries} from "../controllers/watchlist.js"

const router = express.Router()

router.get("/",getWatchlist)
router.post("/",addWatchlist)
router.delete("/",deleteWatchlist)
router.get("/count",countWatchlist)
router.get("/movies/:userId", getWatchlistMovies);
router.get("/series/:userId",getWatchlistSeries)

export default router