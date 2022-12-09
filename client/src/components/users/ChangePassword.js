import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../Logo'
import { useEffect } from 'react';


const ChangePassword = (props) => {

    let data = {
        old_password: "",
        new_password: "",
    }

    const [formData,setFormData] = useState(data)

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    const onFormSubmit = async (e) => {
        e.preventDefault()
        if(formData.old_password === '' || formData.new_password === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            if(props.user ==='user'){
                await axios.get('http://localhost:3500/api/get_user')
                .then(async (res)=>{
                        await axios.post("http://localhost:3500/api/user_update_password",{
                        formData
                        }).then(()=>{
                            toast.success("Password Updated !", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        }).catch((err)=>{
                            toast.error(err.response.data, {
                                position: toast.POSITION.TOP_CENTER
                            });
                            console.log(err);
                        })
                    
                })
                .catch((err)=>{
                    console.log(err);
                })
            }else{
                await axios.get('http://localhost:3500/api/get_user')
                .then(async (res)=>{
                        await axios.post("http://localhost:3500/api/admin_update_password",{
                        formData
                        }).then(()=>{
                            toast.success("Password Updated !", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        }).catch((err)=>{
                            toast.error(err.response.data, {
                                position: toast.POSITION.TOP_CENTER
                            });
                            console.log(err);
                        })
                    
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
            
        }
    }

    const onFormChange= (e) => {
        const {name,value} = e.target
        setFormData({...formData,[name]: value})
    }

    return (
        <div className='max-w-4xl flex justify-center flex-col bg-[#adcbe3] rounded-xl p-4 m-8'>
            <h1 className="text-3xl text-center p-4">
                Change Password
            </h1>
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit} className="text-black">
                    <div className="m-4">
                        <input type="password" name = "old_password" id = "old_password" placeholder='Old Password' className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" value={formData.old_password} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="password" name = "new_password" id = "new_password" placeholder='New Password' className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" value={formData.new_password} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="submit" className='w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 p-4 text-2xl font-medium rounded-xl text-white' value='Update'/>
                    </div>
                </form>
            </div>
            <div className='flex justify-center items-center'>
                <Logo/>
            </div>
            {/* <ToastContainer/> */}
        </div>
    )
}

export default ChangePassword