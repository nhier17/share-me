import React from 'react';
import { Bars } from 'react-loader-spinner';

const Spinner = ({ message })  =>{
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Bars
         height="80"
         width="80"
         color="#4fa94d"
         ariaLabel="bars-loading"
         wrapperStyle={{}}
         wrapperClass=""
         visible={true}
        className="m-5"
      />

      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
}

export default Spinner;