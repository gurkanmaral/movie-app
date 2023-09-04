import express from "express"
import { addFavorites, deleteFavorites, getFavorites, getFavoritesCount, getFavoritesMedia } from "../controllers/favorites.js"

const router = express.Router()

router.get("/",getFavorites)
router.post("/",addFavorites)
router.delete("/",deleteFavorites)
router.get("/count",getFavoritesCount)
router.get("/mediaId", getFavoritesMedia)
export default router