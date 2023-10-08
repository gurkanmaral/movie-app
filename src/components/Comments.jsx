import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../axios'
import userLogo from "../assets/user.png"
import moment from "moment"
const Comments = ({mediaId}) => {

    const [desc,setDesc] = useState("")

    const {currentUser} = useContext(AuthContext)

    const {isLoading,error,data} = useQuery(["comments"],()=>
    makeRequest.get("/comments?mediaId="+mediaId).then((res)=>{
        return res.data;
    }))
    console.log(data)
    const queryClient = useQueryClient();

    const {isLoading:commentsLoading,data:commentsData} = useQuery(["commentsUser"], () => {
        if (!currentUser?.id) {
          // Return an empty object or null if the currentUser is not available
          return {}; // or return null;
        }
    
        return makeRequest
          .get("/users/find/" + currentUser.id)
          .then((res) => res.data);
      }
    );
    console.log(commentsData)

    const mutation = useMutation(
        (newComment)=>{
            return makeRequest.post("/comments",newComment)
        },
        {
            onSuccess: ()=>{
                queryClient.invalidateQueries(["comments"]);
            }
        }

    )

    const handleClick = async (e) => {
        e.preventDefault();
       if(currentUser === null) {
        alert('you have to login')
       }else{
        mutation.mutate({ desc, mediaId});
        setDesc("");
       }
        
      }

  return (
    <div className='comment-container'>
        <div className='write'>
            <img src={commentsData?.profilePic ? "/upload/" + commentsData?.profilePic : userLogo} alt=""
            className='write-img'
            />
            <input type="text" placeholder='Write a comment' onChange={(e)=>setDesc(e.target.value)} 
             value={desc}
            />
          
           <button onClick={handleClick} className='write-button'>
               Send
            </button>
           
        </div>
        {isLoading ? "loading" :
        data?.map((comment,i)=>(
            <div className='comment' key={`comment_${comment.id}`}>
                    <img src={comment.profilePic ? "/upload/" + comment.profilePic : userLogo} alt="" />
                    <div className='info'>
                        <span>{comment.name}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className='date'>{moment(comment.createdAt).fromNow()}</span> 
            </div>
        ))}
    </div>
  )
}

export default Comments