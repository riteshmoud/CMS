import axios from 'axios'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/login.css'

const LodgeComplaint = () => {

    let data = {
        category: 'null',
        sub_category: 'null',
        state: 'null',
        nature: "",
        details: ""
    }

    const [formData,setFormData] = useState(data)
    const [details,setDetails] = useState({category: [],sub_category: [],state: []})

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    useEffect(()=>{
        const getDetails = async () => {
            await axios.get('http://localhost:3500/api/get_details')
            .then((res)=>{
                setDetails(res.data)
            })
        }
        getDetails()
    },[])

    const viewCategory = details.category.map((item,idx)=>{
        return <option value={item.category_name}>{item.category_name}</option>
    })
    const viewSubCategory = details.sub_category.map((item,idx)=>{
        return <option value={item.sub_category_name}>{item.sub_category_name}</option>
    })
    const viewState = details.state.map((item,idx)=>{
        return <option value={item.state_name}>{item.state_name}</option>
    })

    const onFormSubmit = async (e) => {
        e.preventDefault()
        if(formData.category === 'null' || formData.sub_category === 'null' || formData.state === 'null' || formData.nature === ''||formData.details === ''){
            toast.error("Enter all details", {
                position: toast.POSITION.TOP_CENTER
            });
            return
        }
        console.log(formData);
        await axios.post('http://localhost:3500/lodge_complaint',
            {formData}
        ).then(()=>{
            toast.success("Complaint Registered !", {
                position: toast.POSITION.TOP_CENTER
            });
            setFormData({category: 'null',sub_category: 'null',state: 'null',nature: "",details: ""})
        }).catch((err)=>{
            console.log(err);
            toast.error(err.response.data, {
                position: toast.POSITION.TOP_CENTER
            });
            window.location.pathname = '/'
        })
    }

    const onFormChange = (e) => {
        const {name,value} = e.target
        setFormData({...formData,[name]: value})
    }

    return (
    <div className='p-6 bg-[#1f2937] rounded-xl min-w-[70%]'>
        <form onSubmit={onFormSubmit} className='grid grid-cols-2 gap-y-2 gap-x-4'>
            <div className='flex flex-col'>
                <label htmlFor="category" className='my-4'>Category</label>
                <select name="category" id="category" className='p-2 w-[100%]' onChange={(e)=>formData.category = e.target.value}>
                    <option value='null'>Select Category</option>
                    {viewCategory}
                </select>
            </div>

            <div className='flex flex-col'>
                    <label htmlFor="sub-category" className='my-4'>Sub Category</label>
                    <select name="sub-category" id="sub-category" className='p-2 w-[100%]' onChange={(e)=>formData.sub_category = e.target.value}>
                        <option value='null'>Select Sub Category</option>
                        {viewSubCategory}
                    </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="state" className='my-4'>Select State</label>
                <select name="state" id="state" className='p-2 w-[100%]' onChange={(e)=>formData.state = e.target.value}>
                    <option value='null'>Select State</option>
                    {viewState}
                </select>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="nature" className='my-4'>Nature of complaint</label>
                <input type="text" name="nature" id="nature" className='p-2 w-[100%]' value={formData.nature} onChange={onFormChange}/>
            </div>

            <div className='flex flex-col col-span-full'>
                <label htmlFor="details" className='my-4'>Complaint Details</label>
                <textarea name="details" id="details" rows={5} className='resize-none p-4' value={formData.details} onChange={onFormChange}></textarea>
            </div>

            <div>
                <input type="submit" value="Submit" className='my-4 py-4 px-6 bg-black rounded-xl text-white'/>
            </div>
        </form>
    </div>
    )
}

export default LodgeComplaint