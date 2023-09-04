import { db } from "../connect.js"
import jwt from "jsonwebtoken"



export const getRelations = (req,res)=>{
    
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ? "

    db.query(q,[req.query.followedUserId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data.map((relationship)=> relationship.followerUserId))
    })
}
export const getFollowersAndFollowing = (req, res) => {
    const userId = req.query.userId;

    const followersQuery = "SELECT u.* FROM users u JOIN relationships r ON u.id = r.followerUserId WHERE r.followedUserId = ?";
    const followingQuery = "SELECT u.* FROM users u JOIN relationships r ON u.id = r.followedUserId WHERE r.followerUserId = ?";

    db.query(followersQuery, [userId], (err, followerData) => {
        if (err) return res.status(500).json(err);

        db.query(followingQuery, [userId], (err, followingData) => {
            if (err) return res.status(500).json(err);

            const followers = followerData;
            const following = followingData;

            return res.status(200).json({ followers, following });
        });
    });
};
export const addRelations = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")
    
   

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";

    const values=[
        userInfo.id,
        req.body.userId
    ]

    db.query(q,[values],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("Following")
    })
    })
}



export const deleteRelations = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")
    
   

    const q = "DELETE from relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";


    db.query(q,[userInfo.id,req.query.userId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("Unfollow")
    })
    })
}