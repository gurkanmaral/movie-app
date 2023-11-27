import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"


export const getFavorites = (req,res)=>{
 

    const q =   "SELECT userId from favorites WHERE mediaId = ? "

    db.query(q, [req.query.mediaId], (err, data) => {
        if (err) return res.status(500).json(err);
    
       
        return res.status(200).json(data.map((watched)=> watched.userId));
      });
}

export const addFavorites = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid");
  
      const mediaType = req.body.media_type; 
  
      
      const qCount = "SELECT COUNT(*) AS favoritesCount FROM favorites WHERE userId = ? AND media_type = ?";
      db.query(qCount, [userInfo.id, mediaType], (countErr, countResult) => {
        if (countErr) {
          console.error("Error checking favorites count:", countErr);
          return res.status(500).json({ error: "An error occurred while checking favorites count." });
        }
  
        const favoritesCount = countResult[0].favoritesCount;
        if (favoritesCount >= 5) {
          return res.status(403).json({ error: "Each user can add a maximum of five " + mediaType + " to favorites." });
        }
  
        const qInsert = "INSERT INTO favorites (`userId`, `mediaId`, `media_type`) VALUES (?, ?, ?)";
        const values = [userInfo.id, req.body.mediaId, mediaType];
  
        db.query(qInsert, values, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error adding favorite:", insertErr);
            return res.status(500).json({ error: "An error occurred while adding the favorite." });
          }
  
          return res.status(200).json("Media has been added to favorites");
        });
      });
    });
  };

export const deleteFavorites = (req,res)=>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")
    
   

    const q = "DELETE from favorites WHERE `userId` = ? AND `mediaId` = ?";


    db.query(q,[userInfo.id,req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("favorite is removed")
    })
    })
}

export const getFavoritesCount = (req,res)=>{
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("Not logged in")


  jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("token is not valid")



const q = "SELECT mediaId, media_type FROM favorites WHERE userId = ?";


db.query(q,[userInfo.id],(err,data)=>{
    if(err) return res.status(500).json(err)

    return res.status(200).json(data)
})
})
}

export const getFavoritesMedia =  (req,res)=>{
  
  const userId = req.query.userId;
  const q = "SELECT mediaId, media_type FROM favorites WHERE userId = ?";


  db.query(q,[userId],(err,data)=>{
    if(err) return res.status(500).json(err)

    return res.status(200).json(data)
  })

}