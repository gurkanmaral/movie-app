import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"


export const getRating = (req,res)=>{

    const q = "SELECT rating FROM rating WHERE mediaId = ? AND userId = ?";

    db.query(q,[req.query.mediaId,req.query.userId],(err,data)=>{
        if(err) return res.status(500).json(err)

        const ratingValue = data[0]?.rating || null;
         return res.status(200).json(ratingValue);
    })

}


export const addRating = (req, res) => {
    const { userId, media_type, mediaId, rating } = req.body;
    const createdAt =  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    const q = "INSERT INTO rating (userId, media_type, mediaId, rating, createdAt) VALUES (?, ?, ?, ?,?)";
  
    db.query(q, [userId, media_type, mediaId, rating,createdAt], (err, result) => {
      if (err) return res.status(500).json(err);
  
      // If the insertion was successful, you can return the ID of the newly inserted rating
      const insertedId = result.insertId;
      return res.status(201).json({ id: insertedId });
    });
  };


export const updateRating = (req,res) =>{
  
  const { userId, media_type, mediaId, rating } = req.body;
  const q = "UPDATE rating SET rating = ? WHERE mediaId = ? AND userId = ?";

  db.query(q, [rating, mediaId, userId], (err, result) => {
    if (err) return res.status(500).json(err);

    // If the update was successful, you can return the ID of the updated rating
    const updatedId = result.insertId;
    return res.status(200).json({ id: updatedId });
  });
}

export const deleteRating = (req,res)=>{

  const q = "DELETE FROM rating WHERE mediaId = ? AND userId = ?";

  db.query(q,[req.query.mediaId,req.query.userId],(err,data)=>{
    if(err) return res.status(500).json(err)

    return res.status(200).json("rating is removed")
})
}


export const getFriendsRatings = (req,res)=>{
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
          const q = `
          SELECT r.rating, u.id AS userId, u.name, u.profilePic
          FROM rating AS r
          JOIN users AS u ON (u.id = r.userId)
          WHERE r.mediaId = ? AND r.userId IN (?)
        `;
          
          db.query(q, [req.query.mediaId, followingIDs], (err, data) => {
            if (err) {
              return res.status(500).json(err);
            }
          
            return res.status(200).json(data);
          });
        });
    });
}
