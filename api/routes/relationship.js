import express from "express"
import { getRelations,addRelations,deleteRelations,getFollowersAndFollowing  } from "../controllers/relationship.js"

const router = express.Router()

router.get("/",getRelations)
router.post("/",addRelations)
router.delete("/",deleteRelations)
router.get("/followers-following", getFollowersAndFollowing);


export default router