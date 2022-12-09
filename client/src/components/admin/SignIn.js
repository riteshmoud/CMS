import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../Logo'

const SignIn = () => {

    const data = {
        username: '',
        password: ''
    }

    const [formData,setFormData] = useState(data)

    const onFormSubmit = (e) => {
        e.preventDefault()
        if(formData.username === '' || formData.password === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            axios.post("http://localhost:3500/api/admin_login",{
                formData
            }).then(()=>{
                window.location.pathname = '/admin_login/dashboard'
            }).catch((err)=>{
                toast.error(err.response.data, {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(err);
            })
        }
    }

    const onFormChange = (e) => {
        const {name,value} = e.target
        setFormData({...formData,[name]: value})
    }

    return (
        <div className='max-w-4xl flex justify-center flex-col bg-[#adcbe3] rounded-xl p-4'>
            <h1 className="text-3xl text-center p-4">
                Admin Login
            </h1>
            <div className="flex justify-center items-center flex-col">
                <form onSubmit={onFormSubmit}>
                    <div className="m-4">
                        <input type="text" name="username" id="username" className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" placeholder='Username' value={formData.username} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="password" name="password" id="password" className="p-4 text-2xl w-[100%] border-black border-2 rounded-xl" placeholder='Password' value={formData.password} onChange={onFormChange}/>
                    </div>
                    <div className="m-4">
                        <input type="submit" className='w-[100%] bg-blue-500 hover:cursor-pointer hover:bg-blue-800 p-4 text-2xl font-medium rounded-xl text-white' value='Login'/>
                    </div>
                </form>
            </div>
            <div className='flex justify-center items-center'>
                <Logo/>
            </div>
        </div>
    )
}

export default SignIn