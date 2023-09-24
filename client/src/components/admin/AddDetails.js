import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDetails = () => {

    const [textArea,setTextArea] = useState(null)
    let data,type

    const onPost = async (e) => {
        if(data === ''){
            toast.error('Enter details', {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            await axios.post('http://localhost:3500/api/post_details',{data: data,type: type})
            .then((res)=>{
                toast.success('Details Added', {
                    position: toast.POSITION.TOP_CENTER
                });
                // setTextArea(null)
            })
            .catch((err)=>{
                console.log(err);
                toast.error(err.response.data, {
                    position: toast.POSITION.TOP_CENTER
                });
            })
        }
    }

    const onChange = (e) => {
        data = e.target.value
        setTextArea(()=>{
            return (
                <div>
                    <textarea name={e.target.id} id={e.target.id} cols='30' rows="5" className='w-[100%] p-4 m-4 overflow-hidden resize-none' placeholder={`Add ${e.target.id}`} value={data} onChange={onChange}></textarea>
                    <button className='bg-green-600 rounded-xl text-xl text-white px-4 py-2 ml-[0.5rem]' onClick={onPost}>Post</button>
                    <button className='bg-red-500 rounded-xl text-xl text-white px-4 py-2 ml-[0.5rem]' onClick={()=>setTextArea(null)}>Cancel</button>
                </div>
            )
        })
    }

    const onAddBtnClick = (e) => {
        type = e.target.id
        const placeholder = `Add ${type}`
        data = ''
        setTextArea(()=>{
            return (
                <div>
                    <textarea name={e.target.id} id={e.target.id} cols="30" rows="5" className='w-[100%] p-4 m-4 overflow-hidden resize-none' placeholder={placeholder} value='' onChange={onChange}></textarea>
                    <button className='bg-green-600 rounded-xl text-xl text-white px-4 py-2 ml-[0.5rem]' onClick={onPost}>Post</button>
                    <button className='bg-red-500 rounded-xl text-xl text-white px-4 py-2 ml-[0.5rem]' onClick={()=>{setTextArea(null)}}>Cancel</button>
                </div>
            )
        })
    }

    return (
        <div className={`flex justify-between self-start my-8 p-4 flex-col`}>
            <div>
                <button id="category" className="py-2 px-4 text-xl text-black mx-4 bg-white rounded-xl" onClick={onAddBtnClick}>Add Category</button>
                <button id="sub_category" className="py-2 px-4 text-xl text-black mx-4 bg-white rounded-xl" onClick={onAddBtnClick}>Add Sub Category</button>
                <button id="state" className="py-2 px-4 text-xl text-black mx-4 bg-white rounded-xl" onClick={onAddBtnClick}>Add State</button>
            </div>
            {textArea}
        </div>
    )
}

export default AddDetails