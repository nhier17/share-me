import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

import { client } from "../client"

const Login = () => {
const navigate = useNavigate();
//decode jwt
const decodeJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(window.atob(base64)); 
    return decodedData
}
//on sucess
const handleSuccess = (credentialResponse) => {
        
    const idToken = credentialResponse.credential;
    //decode id_tkoen to extract user info
    const decodedToken = decodeJwt(idToken);
    
    if(decodedToken) {
        const { name, picture,sub } = decodedToken
        const googleId = sub || '';

        const doc = {
            _id: googleId,
            _type: 'user',
            userName: name,
            image: picture
        }
        localStorage.setItem('user', JSON.stringify(doc));
        client.createIfNotExists(doc)
        .then(() => {
            navigate("/", {replace: true});
        })
        .catch((err) => {
             console.log("Error creating user",err);
         })
    } else {
        console.error("Failed to decode id_token")
    }
 
  
    
}
//on error

const handleError = (error) => {
    console.log("Login failed",error);
}
  return (
    <div className="flex justify-start items-center flex-col h-screen">
    <div className=" relative w-full h-full">
      <video
        src={shareVideo}
        type="video/mp4"
        loop
        controls={false}
        muted
        autoPlay
        className="w-full h-full object-cover"
      />

      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
        <div className="p-5">
          <img src={logo} width="130px" alt="logo" />
        </div>

        <div className="shadow-2xl">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            cookiePolicy="single_host_origin"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
