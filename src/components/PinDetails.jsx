import React, { useState, useEffect,useCallback } from 'react'
import { Link, useParams } from "react-router-dom"
import { MdDownloadForOffline } from 'react-icons/md';
import { v4 as uuidv4 } from "uuid"

import { client, urlFor } from "../client"
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner"
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';


const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetails, setPinDetails] = useState(null)
  const [comment, setComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)

  const { pinId } = useParams()

  //fetch the pin details
  
    const fetchPinDetails = useCallback(() => {
      let query = pinDetailQuery(pinId)
  
      if(query) {
        client.fetch(query)
        .then((data) => {
          setPinDetails(data[0])
  
          if(data[0]) {
            query = pinDetailMorePinQuery(data[0]);
            client.fetch(query)
            .then((res) => {
               setPins(res)
             })
          }
        })
      }
    },[pinId]);
  
    
    useEffect(() => {
      fetchPinDetails();
  }, [fetchPinDetails]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };
  

  if(!pinDetails) return <Spinner messsge="Loading pin..." />

  return (
    <>  
    <div className="flex xl:flex-row flex-col m-auto bg-white max-w-[1500px] rounded-[32px]">
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img 
        src={pinDetails?.image && urlFor(pinDetails.image).url()} 
        alt="pin_image"
        className="rounded-t-3xl rounded-b-lg"
         />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a
               href={`${pinDetails.image.asset.url}?dl=`}
               download
               className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
            >
              <MdDownloadForOffline />
            </a>
          </div>    
        </div>
        <div className="">
          <h1 className="text-4xl font-bold break-words mt-3">{pinDetails.title}</h1>
          <p className="mt-3">{pinDetails.about}</p>
        </div>
        <Link to={`/user-profile/${pinDetails?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
        <img src={pinDetails?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetails?.postedBy.userName}</p>
        </Link>
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-370 overflow-y-auto">
          {pinDetails?.comments?.map((comment, i) => (
            <div className="flex gap-2 mt-5 items-center rounded-lg" key={i}>
              <img 
               className="w-10 h-10 rounded-full cursor-pointer"
              src={comment.postedBy.image}
               alt="user_profile" />
               <div className="flex flex-col">
                <p className="font-bold">{comment.postedBy?.userName}</p>
                <p>{comment.comment}</p>
               </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-6 gap-3">
          <Link to={`/user-profile/${pinDetails?.postedBy._id}`}>
          <img src={pinDetails?.postedBy.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
          </Link>
          <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
              type="submit"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
              >
                {addingComment ? 'Posting comment' : 'Post'}
              </button>
        </div>
      </div>
    </div>
   {pins?.length > 0 ? (
    <>
    <h2 className="text-center font-bold text-2xl mt-8 mb-4">
    You may also like
    </h2>
    <MasonryLayout pins={pins}/>
    </>
   ) : (
    <Spinner message="loading more pins..." />
   )}
   </>
  )
}

export default PinDetails
