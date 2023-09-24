import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../Logo'
import { useEffect } from 'react';
import './style/login.css'


const UserProfile = () => {

    let data = {
        fullname: "",
        email: "",
        state: "NA",
        password: "",
        contact: ""
    }

    const [formData,setFormData] = useState(data)

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    useEffect(()=>{
        const get_user = async ()=>{
            await axios.get('http://localhost:3500/api/get_user')
            .then((res)=>{
                setFormData({
                    fullname: res.data.fullname,
                    email: res.data.email,
                    state: res.data.state,
                    password: res.data.password,
                    contact: res.data.contact
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        get_user()
    },[])

    const onFormSubmit = (e) => {
        e.preventDefault()
        if(formData.fullname === '' || formData.email === '' || formData.password === '' || formData.contact === '' || formData.state === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            axios.post("http://localhost:3500/api/user_update",{
                formData
            }).then((res)=>{
                console.log(res);
                // setFormData({
                //     fullname: res.data.fullname,
                //     email: res.data.email,
                //     contact: res.data.contact,
                //     state: res.data.state
                // })
                toast.success("Profile Updated !", {
                    position: toast.POSITION.TOP_CENTER
                });
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
        <div className='max-w-4xl flex justify-center flex-col bg-[#1f2937] rounded-xl p-4 m-8'>
            <h1 className="text-2xl p-2 text-white">
                Profile
            </h1>
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit} className="text-black grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="m-2">
                        <label htmlFor="fullname" className="text-lg py-4">Name</label>
                        <input type="text" name = "fullname" id = "fullname" className="p-2 text-lg w-[100%] border-black border-2 rounded-xl" value={formData.fullname} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                        <label htmlFor="email" className="text-lg py-4">Email</label>
                        <input type="email" name = "email" id = "email" className="p-2 text-lg w-[100%] border-black border-2 rounded-xl" value={formData.email} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                    <label htmlFor="state" className="text-lg py-4">State</label>
                        <input type="text" name = "state" id = "state" className="p-2 text-lg w-[100%] border-black border-2 rounded-xl" value={formData.state} onChange={onFormChange}/>
                    </div>
                    <div className="m-2">
                    <label htmlFor="contact" className="text-lg py-4">Contact</label>
                        <input type="number" name = "contact" id = "contact" className="p-2 text-lg w-[100%] border-black border-2 rounded-xl"  value={formData.contact} onChange={onFormChange}/>
                    </div>
                    <div className="m-2 col-span-full">
                        <input type="submit" className='w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 p-2 text-lg font-medium rounded-xl text-white' value='Update'/>
                    </div>
                </form>
            </div>
            {/* <div className='flex justify-center items-center'>
                <Logo/>
            </div> */}
            {/* <ToastContainer/> */}
        </div>
    )
}

export default UserProfile