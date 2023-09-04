import express from "express"
import { getComments,addComment, userComments, getFollowingComments, deleteComments } from "../controllers/comment.js"

const router = express.Router()

router.get("/",getComments)
router.post("/",addComment)
router.get("/users",userComments)
router.get("/follow", getFollowingComments)
router.delete("/",deleteComments)
export default router