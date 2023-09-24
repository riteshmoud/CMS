import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import Logo from '../Logo'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react'

const SignIn = () => {

    let data = {
        email: "",
        password: ""
    }

    const [formData,setFormData] = useState(data)

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    const onFormSubmit = async (e) => {
        e.preventDefault()
        if(formData.email === '' || formData.password === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            await axios.post("http://localhost:3500/api/user_signin",{
                formData
            }).then(()=>{
                setFormData({email: "",password: ""})
                window.location.pathname = '/user_login/dashboard'
            }).catch((err)=>{
                toast.error(err.response.data, {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(err);
            })
        }
    }

    const onFormChange= (e) => {
        const {name,value} = e.target
        setFormData({...formData,[name]: value})
    }

    return (
        <div className='flex justify-center flex-col bg-[#1f2937] shadow-sm shadow-cyan-400 rounded-xl p-4'>
            {/* <h1 className="text-xl text-center ">
                User Login
            </h1> */}
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit} className='w-full'>
                    <div className="m-2">
                        <input type="email" name="email" className="border-none w-full py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Username' value={formData.email} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="password" name="password" className="border-none w-full py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Password' value={formData.password} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="submit" className='border-none w-full p-2 text-lg w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 font-medium rounded-xl text-white' value='Login'/>
                    </div>
                </form>
                <div className="my-2">
                    <p className="text-xl text-center m-2">
                            <Link to="/" className='text-lg text-blue-500 hover:text-blue-900'>Forgot Password?</Link>
                    </p>
                    <p className="text-xl text-center m-2">
                        <span className='text-lg text-blue-500'>Don't have an account? </span>
                            <Link to="/users/Registration" className='text-red-500 hover:text-red-900 text-lg'>Register Here</Link>
                    </p>
                </div>
            </div>
            <div className='flex justify-center items-center '>
                <Logo/>
            </div>
            {/* <ToastContainer/> */}
        </div>
    )
}

export default SignIn