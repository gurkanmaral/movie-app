import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getLikes = (req,res)=>{

    const q = "SELECT userId from likes WHERE mediaId = ? "

    db.query(q,[req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data.map((like)=> like.userId))
    })
}

export const addLike = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")

        const mediaType = req.body.media_type;
      
       
        const q = "INSERT INTO likes (`userId`, `mediaId`, `media_type`, `likedAt`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.mediaId,
            mediaType,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          ];

    db.query(q, [values],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("Post has been liked")
    })
    })
}


export const deleteLike = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")
    
   

    const q = "DELETE from likes WHERE `userId` = ? AND `mediaId` = ?";


    db.query(q,[userInfo.id,req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("Like is removed")
    })
    })
}

export const likeCount = (req,res)=>{

    const userId = req.query.userId;
  
    
    const qMovies = "SELECT COUNT(*) AS likedMoviesCount FROM likes WHERE userId = ? AND media_type = 'movies'";
  
   
    const qSeries = "SELECT COUNT(*) AS likedSeriesCount FROM likes WHERE userId = ? AND media_type = 'series'";
  
 
    Promise.all(
      [
        new Promise((resolve, reject) => {
          db.query(qMovies, [userId], (err, data) => {
            if (err) reject(err);
            else resolve(data[0].likedMoviesCount);
          });
        }),
        new Promise((resolve, reject) => {
          db.query(qSeries, [userId], (err, data) => {
            if (err) reject(err);
            else resolve(data[0].likedSeriesCount);
          });
        }),
      ]
    )
      .then(([moviesCount, seriesCount]) => {
       
        const result = { likedMoviesCount: moviesCount, likedSeriesCount: seriesCount };
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
}


export const getLikedMovies = (req,res)=>{

  const userId = req.params.userId;

  const q = "SELECT mediaId FROM likes WHERE userId = ? AND media_type = 'movies'";


  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

   
    return res.status(200).json(data);
  });


}
export const getLikedSeries = (req,res)=>{

  const userId = req.params.userId;

  const q = "SELECT mediaId FROM likes WHERE userId = ? AND media_type = 'series'";


  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

   
    return res.status(200).json(data);
  });


}