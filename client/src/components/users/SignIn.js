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
        <div className='max-w-4xl flex justify-center flex-col bg-[#adcbe3] rounded-xl p-4'>
            <h1 className="text-3xl text-center p-4">
                User Login
            </h1>
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit}>
                    <div className="m-4">
                        <input type="email" name="email" className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" placeholder='Username' value={formData.email} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="password" name="password" className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" placeholder='Password' value={formData.password} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="submit" className='w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 p-4 text-2xl font-medium rounded-xl text-white' value='Login'/>
                    </div>
                </form>
                <div className="my-4">
                    <p className="text-xl text-center m-2">
                            <Link to="/" className='text-blue-500 hover:text-blue-900'>Forgot Password?</Link>
                    </p>
                    <p className="text-xl text-center m-2">
                        <span className='text-blue-500'>Don't have an account? </span>
                            <Link to="/users/Registration" className='text-red-500 hover:text-red-900'>Register Here</Link>
                    </p>
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <Logo/>
            </div>
            {/* <ToastContainer/> */}
        </div>
    )
}

export default SignIn