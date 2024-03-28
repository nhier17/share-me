import React, {useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId)
    client.fetch(query)
    .then((data) => {
      setUser(data[0])
    })

  },[userId])

  useEffect(() => {
    if (text === 'Created') {
      const createdQuery = userCreatedPinsQuery(userId)
      client.fetch(createdQuery)
      .then((data) => {
        setPins(data)
      })
    } else {
      const savedQuery = userSavedPinsQuery(userId)
      client.fetch(savedQuery)
      .then((data) => {
        setPins(data)
      })
    }
  
  }, [text, userId])

  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate('/login');
  }

  if (!user) {
return <Spinner message="loading profile..." />
  }
const randomImg  = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img 
            className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            src={randomImg} 
            alt="user_pic" />
              <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
             <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === user._id && (
          
          <AiOutlineLogout
          className="cursor-pointer text-xl"
           onClick={logout}/>
                
              )}
          </div>
          </div>
          <div className="text-center mb-7">
            <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent)
              setActiveBtn('created')
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
          </div>
            {pins?.length ? (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No pins found!
              </div>
            )}
         


        </div>
      </div>
    </div>
  )
}

export default UserProfile
