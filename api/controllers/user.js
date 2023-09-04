import {db} from "../connect.js"
import jwt from "jsonwebtoken"

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    
    // Check if the data array has any elements
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req,res) =>{
   
    const token = req.cookies.accessToken;

    if(!token) return res.status(401).json("not authenticated")

   jwt.verify(token,"secretkey",(err,userInfo)=>{
    if(err) return res.status(403).json("token is not valid")

    const q = "UPDATE users SET `name`=?, `city`=?, `website`=?,`ProfilePic`=? WHERE id=? "
    
    db.query(q,[
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        userInfo.id
    ],(err,data)=>{
        if(err) res.status(500).json(err)

        if(data.affectedRows > 0) return res.json("updated")

        return res.status(403).json("you can update only your post")
    })
})
}
export const getSearchedUsers = (req, res) => {
    const searchTerm = req.params.searchTerm;
  
    const q = "SELECT * FROM users WHERE name LIKE ?";
  
    db.query(q, [`%${searchTerm}%`], (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
  };

  export const getAllUsers = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(500).json(err);
      const userId = userInfo.id;
  
      const q = `
        SELECT u.*
        FROM users u
        LEFT JOIN relationships r ON u.id = r.followedUserId AND r.followerUserId = ?
        WHERE r.followerUserId IS NULL AND u.id != ?
      `;
  
      db.query(q, [userId,userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  };