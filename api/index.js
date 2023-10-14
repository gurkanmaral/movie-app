const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import likeRoutes from "./routes/likes.js"
import commentRoutes from "./routes/comment.js"
import watchedRoutes from "./routes/watched.js"
import watchlistRoutes from "./routes/watchlist.js"
import ratingRoutes from "./routes/rating.js"
import favoritesRoutes from "./routes/favorites.js"
import multer from "multer";
import relationshipRoutes from "./routes/relationship.js"
const app = express();


//middlewares
app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Credentials",true)

    next()
})

app.use(express.json())


app.use(cors({
    origin:"http://localhost:5173"
}))

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"../public/upload")
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})

const upload = multer({storage:storage})

app.post("/api/upload", upload.single("file"),(req,res)=>{
    const file = req.file
    res.status(200).json(file.filename)
})
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/likes",likeRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/watched",watchedRoutes)
app.use("/api/watchlist", watchlistRoutes)
app.use("/api/rating",ratingRoutes)
app.use("/api/relationships",relationshipRoutes)
app.use("/api/favorites",favoritesRoutes)

app.listen(8800,()=>{
    console.log("API working")
});