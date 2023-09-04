import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getWatchlist = (req,res)=>{

    const q = "SELECT userId from watchlist WHERE mediaId = ? "

    db.query(q,[req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json(data.map((watched)=> watched.userId))
    })
}

export const addWatchlist = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")

        const mediaType = req.body.media_type; // The type of media ('movies' or 'series')
      
       
        const q = "INSERT INTO watchlist (`userId`, `mediaId`,`media_type`,`addedAt` ) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.mediaId,
            mediaType,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          ];

    db.query(q, [values],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("Media has been added watchlist")
    })
    })
}


export const deleteWatchlist = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in")

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("token is not valid")
    
   

    const q = "DELETE from watchlist WHERE `userId` = ? AND `mediaId` = ?";


    db.query(q,[userInfo.id,req.query.mediaId],(err,data)=>{
        if(err) return res.status(500).json(err)

        return res.status(200).json("media is removed from watchlist")
    })
    })
}

export const countWatchlist = (req,res)=>{
    const userId = req.query.userId;
  
    // Fetch watched count for movies
    const qMovies = "SELECT COUNT(*) AS watchlistMoviesCount FROM watchlist WHERE userId = ? AND media_type = 'movies'";
  
    // Fetch watched count for series
    const qSeries = "SELECT COUNT(*) AS watchlistSeriesCount FROM watchlist WHERE userId = ? AND media_type = 'series'";
  
    // Perform both queries in parallel using Promise.all
    Promise.all(
      [
        new Promise((resolve, reject) => {
          db.query(qMovies, [userId], (err, data) => {
            if (err) reject(err);
            else resolve(data[0].watchlistMoviesCount);
          });
        }),
        new Promise((resolve, reject) => {
          db.query(qSeries, [userId], (err, data) => {
            if (err) reject(err);
            else resolve(data[0].watchlistSeriesCount);
          });
        }),
      ]
    )
      .then(([moviesCount, seriesCount]) => {
        // Combine the results and return them
        const result = { watchlistMoviesCount: moviesCount, watchlistSeriesCount: seriesCount };
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
}


export const getWatchlistMovies = (req,res)=>{

  const userId = req.params.userId;

  const q = "SELECT mediaId FROM watchlist WHERE userId = ? AND media_type = 'movies'";


  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Return the list of media IDs of watched movies for the user
    return res.status(200).json(data);
  });


}
export const getWatchlistSeries = (req,res)=>{

  const userId = req.params.userId;

  const q = "SELECT mediaId FROM watchlist WHERE userId = ? AND media_type = 'series'";


  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Return the list of media IDs of watched movies for the user
    return res.status(200).json(data);
  });


}