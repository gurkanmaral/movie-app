import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../axios'
import userLogo from "../assets/user.png"
import moment from "moment"

const SeriesComments = ({mediaId}) => {

    const [desc,setDesc] = useState("")
    const {currentUser} = useContext(AuthContext)

    const {isLoading,error,data} = useQuery(["seriesComments"],()=>
        makeRequest.get("/comments?mediaId="+mediaId).then((res)=>{
            return res.data;
        })
    )
    console.log(data)
    const {isLoading:commentsLoading,data:seriesUserData} = useQuery(["seriesCommentsUsers"], () => {
        if (!currentUser?.id) {
          
          return {}; 
        }
    
        return makeRequest
          .get("/users/find/" + currentUser.id)
          .then((res) => res.data);
      }
    );
    console.log(seriesUserData)
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newComment)=>{
            return makeRequest.post("/comments", newComment)
        },
        {
            onSuccess: ()=>{
                queryClient.invalidateQueries(["seriesComments"]);
            }
        }
    )

    const handleClick = async (e) => {
        e.preventDefault();
       
        mutation.mutate({ desc, mediaId});
        setDesc("");
      }

  return (
    <div className='comment-container'>

        <div className='write'>
            <img src={seriesUserData?.profilePic ? "/upload/" + seriesUserData?.profilePic : userLogo} alt="" 
            className='write-img'
            />
            <input type="text" placeholder='Write a comment' onChange={(e)=>setDesc(e.target.value)} 
             value={desc}
            />
            <button onClick={handleClick} className='write-button'>Send
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

export default SeriesComments