import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/login.css'
import Logo from '../Logo'


const Registration = () => {

    let data = {
        fullname: "",
        email: "",
        password: "",
        contact: ""
    }

    const [formData,setFormData] = useState(data)

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    const onFormSubmit = (e) => {
        e.preventDefault()
        if(formData.fullname === '' || formData.email === '' || formData.password === '' || formData.contact === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            axios.post("http://localhost:3500/api/user_registration",{
                formData
            }).then(()=>{
                toast.success("Registration Successful !", {
                    position: toast.POSITION.TOP_CENTER
                });
                setFormData({fullname: "",email: "",password: "",contact: ""})
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
        // <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        //     <Logo/>
        <div className='flex justify-center flex-col bg-[#1f2937] shadow-sm shadow-cyan-400 rounded-xl p-4'>
            {/* <h1 className="text-2xl text-center p-2">
                User Registration
            </h1> */}
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit} className="text-black w-full">
                    <div className="m-2">
                        <input type="text" name = "fullname" id = "fullname" className="border-none py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Full Name' value={formData.fullname} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="email" name = "email" id = "email" className="border-none py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Email ID' value={formData.email} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="password" name = "password" id = "password" className="border-none py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Password' value={formData.password} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="number" name = "contact" id = "contact" className="border-none py-2 px-4 text-lg w-[100%] border-black border-2 rounded-xl" placeholder='Contact No' value={formData.contact} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <input type="submit" className='border-none w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 p-2 text-lg font-medium rounded-xl text-white' value='Register'/>
                    </div>
                </form>
                <div className="my-2 text-lg">
                    Already Registered? 
                        <Link to="/users/SignIn" className='text-blue-500 hover:text-blue-900'> Sign In </Link>
                </div>
            </div>
            <div className='flex justify-center items-center p-2'>
                <Logo/>
            </div>
            {/* <ToastContainer/> */}
        </div>
    // </div>
    )
}

export default Registration