import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"


export const getComments = (req,res)=>{

    const q = `SELECT c.*, u.id AS userId,name,profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.mediaId = ? ORDER BY c.createdAt DESC`

    db.query(q,[req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data)
    })
}

export const addComment = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")


        
    const q = "INSERT INTO comments (`desc`,`createdAt`,`userId`,`mediaId`) VALUES (?)";

    const values = [
        req.body.desc,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        req.body.mediaId

    ]
    
    db.query(q,[values],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("comment has been created")
    })

    })

}


export const deleteComments = (req,res)=>{
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("Not logged in")

  jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("token is not valid")

    const q = "DELETE from comments WHERE `userId` = ? AND `mediaId` = ?";

    db.query(q,[userInfo.id,req.query.mediaId],(err,data)=>{
      if(err) return res.status(500).json(err)

      return res.status(200).json("favorite is removed")
  })
  
  })
}

export const userComments = (req,res)=>{
    
    const q = `SELECT c.*, u.id AS userId, name, profilePic 
    FROM comments AS c 
    JOIN users AS u ON (u.id = c.userId)
    WHERE c.mediaId = ? AND c.userId = ? 
    ORDER BY c.createdAt DESC`;

// Assuming you also receive the 'userId' from the request (query or body)
const mediaId = req.query.mediaId;
const userId = req.query.userId; // Assuming you are using query parameters, adjust this if needed

db.query(q, [mediaId, userId], (err, data) => {
if (err) return res.status(500).json(err);

return res.status(200).json(data);
});
}

export const getFollowingComments = (req,res)=>{
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(500).json(err);
        const userId = userInfo.id;
    
        const followersQuery = "SELECT followedUserId FROM relationships WHERE followerUserId = ?";
    
        db.query(followersQuery, [userId], (followerErr, followerData) => {
            if (followerErr) {
              return res.status(500).json(followerErr);
            }
        
            const followingIDs = followerData.map((follower) => follower.followedUserId);
        
            if (followingIDs.length === 0) {
              // If the currentUser is not following anyone, return an empty array
              return res.status(200).json([]);
            }
        
            // Step 2: Get the comments of the users that the currentUser is following
            const q = `SELECT c.*, u.id AS userId, name, profilePic
                       FROM comments AS c
                       JOIN users AS u ON (u.id = c.userId)
                       WHERE c.mediaId = ? AND c.userId IN (?)
                       ORDER BY c.createdAt DESC`;
        
            db.query(q, [req.query.mediaId, followingIDs], (err, data) => {
              if (err) {
                return res.status(500).json(err);
              }
            
              return res.status(200).json(data);
            });
          });
      });
}