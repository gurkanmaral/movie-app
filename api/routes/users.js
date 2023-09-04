import express from "express"
import { getSearchedUsers, getUser,updateUser,getAllUsers } from "../controllers/user.js"

const router = express.Router()


router.get("/find/:userId",getUser)
router.put("/",updateUser)
router.get("/search/:searchTerm",getSearchedUsers)
router.get("/",getAllUsers)


export default router