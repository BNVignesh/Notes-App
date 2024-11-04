import React, { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import PasswordInput from '../../components/passwordinput/PasswordInput';
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const navigate=useNavigate();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!name){
      setError("please enter your name");
      return;
    }
    if(!validateEmail(email)){
      setError("please enter valid email");
      return;
    }
    if(!password){
      setError("please enter the password");
      return;

    }
    setError("");
    try{
      console.log("trying to send request");
      const response=await axiosInstance.post("/create-account",{
        fullName:name,
        email:email,
        password:password
      })
      console.log(response);
      if(response.data && response.data.error){
        setError(response.data.error);
        return;
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken)
        navigate('/dashboard');
      }
    }catch(error){
      if(error.response && error.response.data & error.response.data.message){
        setError(error.response.data.message);
      }else
      {setError("An unexpected error occured. Please try again");}
    }
  }
  return (
    <div>
      <Navbar/>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSubmit}>
            <h4 className='text-2xl mb-7'>signup</h4>
            <input type="text" placeholder='name' className='input-box' onChange={(e)=>{setName(e.target.value)}}/>
            <input type="email" placeholder='Email' className='input-box' onChange={(e)=>{setEmail(e.target.value)}}/>
            <PasswordInput value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary'>create account</button>
            <p className='text-sm text-center mt-4'>
             have an account?{" "}
              <Link to='/login' className='font-medium text-primary underline'>login</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
