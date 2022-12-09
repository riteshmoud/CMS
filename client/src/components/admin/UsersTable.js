import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersTable = (props) => {
    const header = props.headings.map((item)=>{
        return (
            <th className='p-4'>{item}</th>
        )
    })

    const [list,setList] = useState([])
    // const [details,setDetails] = useState('')

    useEffect(()=>{
        const fetch_users = async ()=>{
            if(props.user === 'admin'){
                await axios.get('http://localhost:3500/api/get_users')
                .then((res)=>{
                    setList(res.data)
                })
                .catch((err)=>{
                    toast.error(err.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                })
            }
        }
        fetch_users()
    })

    const onDelete = async (e) => {
        await axios.get('http://localhost:3500/api/delete_user',{
            params: list[e.target.id]
        })
        .then((res)=>{
            toast.success(res.data, {
                position: toast.POSITION.TOP_CENTER
            });
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const showList = list.map((user,idx)=>{ 
        return(
            <tr className='bg-[#e7eff6] text-left text-black text-xl my-4'>
                <td className='p-4'>{user.user_id}</td>
                <td className='p-4'>{user.email}</td>
                <td className='p-4'>{user.fullname}</td>
                <td className='p-4'>{user.contact}</td>
                <td className={'p-4'}>{user.state}</td>
                <td className={'p-4'}>{user.registered_on}</td>
                <td className='p-4'>
                    <button id = {idx} className="py-2 px-4 text-2xl bg-red-500 rounded-xl text-white" onClick={onDelete}>Remove</button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <table className='border-separate'>
                <thead>
                    <tr className='bg-[#adcbe3] text-left text-black text-2xl my-4'>
                        {header}
                    </tr>
                </thead>
                <tbody>
                    {showList}
                </tbody>
            </table>
            {/* {details} */}
        </div>
    )
}

export default UsersTable