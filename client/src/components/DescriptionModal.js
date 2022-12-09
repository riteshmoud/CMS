import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import '../DescriptionModal.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DescriptionModal = (props) => {

    const [takeRemark,setTakeRemark] = useState(null)
    // const [remarks,setRemarks] = useState('')
    let rem

    const onClose = (e) => {
        props.fun('')
    }

    const onRemarkChange = (e) => {
        setTakeRemark(()=>{
            rem = e.target.value
            return (
                <>
                <textarea name="remark" id="remark" cols="30" rows="5" className='w-[100%] p-4 my-4 resize-none' placeholder='Add Remark' value={e.target.value} onChange={onRemarkChange}></textarea>
                <button className='closeBtn bg-green-600 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={postRemark}>Post</button>
                <button className='bg-red-500 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={()=>setTakeRemark(null)}>Cancel</button>
                </>
            )
        })
    }

    const postRemark = async (e) => {
        await axios.post('http://localhost:3500/api/post_remarks',{rem: rem,comp_id: props.comp.comp_id})
        .then((res)=>{
            toast.success(res.data, {
                position: toast.POSITION.TOP_CENTER
            });
        })
        .catch((err)=>{
            toast.error(err.response.data, {
                position: toast.POSITION.TOP_CENTER
            });
        })
    }

    const showRemark = async (e) => {
        await axios.get('http://localhost:3500/api/fetch_remarks',{
            params: {
                comp_id: props.comp.comp_id
            }
        })
        .then((res)=>{
            rem = res.data.remarks
            setTakeRemark(()=>{
                return (
                    <>
                    <textarea name="remark" id="remark" cols="30" rows="5" className='w-[100%] p-4 my-4 resize-none' placeholder='Add Remark' value={res.data.remarks} onChange={onRemarkChange}></textarea>
                    <button className='closeBtn bg-green-600 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={postRemark}>Post</button>
                    <button className='bg-red-500 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={()=>setTakeRemark(null)}>Cancel</button>
                    </>
                )
            })
        })
    }

    const onChangeStatus = (e) => {
        const formData = {comp_id: props.comp.comp_id,status: e.target.value}
        const update = async () => {
            await axios.post('http://localhost:3500/api/change_status',{formData})
            .then((res)=>console.log(res))
            .catch((err)=>console.log(err))
        }
        update()
    }

    const addItems = (comp) => {
        if(props.user === 'user'){
            return <p className='text-2xl'><span className='text-red-500 font-bold'>Remarks: </span>{props.comp.remarks}</p>
        }else{
            const altStatus = () => props.comp.status === 'Pending' ? 'Completed' : 'Pending'
            return (
                <>
                    {/* <button className='closeBtn bg-blue-500 rounded-xl text-2xl text-white px-4 ml-[0.5rem]' onClick={onClose}>Close</button> */}
                    <select name="changeStatus" id="changeStatus" className='bg-green-600 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={onChangeStatus}>
                        <option value={props.comp.status}>{props.comp.status}</option>
                        <option value={altStatus()}>{altStatus()}</option>
                    </select>
                    <button className=' bg-blue-500 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={showRemark}>Add Remark</button>
                </>
            )
        }
    }

    return(
        <div className="desc-main-container">
            <div className="desc-sec-container rounded-xl">
                <h1 className='text-3xl'>{props.comp.nature}</h1>
                <p className='text-2xl'><span className='text-red-500 font-bold'>Details: </span>{props.comp.details}</p>
                <div>
                    {addItems()}
                    <button className='closeBtn bg-blue-500 rounded-xl text-2xl text-white px-4 py-2 ml-[0.5rem]' onClick={onClose}>Close</button>
                </div>
                {takeRemark}
            </div>
        </div>
        )
    }

export default DescriptionModal