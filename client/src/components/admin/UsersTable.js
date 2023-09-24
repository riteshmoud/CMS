import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/table.css'

const UsersTable = (props) => {
    const header = props.headings.map((item)=>{
        return (
            <th className='p-2'>{item}</th>
        )
    })

    const [list,setList] = useState([])
    const [isDeleted,setIsDeleted] = useState(false)
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
    },[isDeleted])

    const onDelete = async (e) => {
        await axios.delete(`http://localhost:3500/api/delete_user/${e.target.id}`)
        .then((res)=>{
            toast.success(res.data, {
                position: toast.POSITION.TOP_CENTER
            });
            setIsDeleted(true)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const showList = list.map((user,idx)=>{ 
        return(
            <tr className='bg-[#e7eff6] text-left text-black text-md my-4'>
                <td className='p-2'>{user.user_id}</td>
                <td className='p-2'>{user.email}</td>
                <td className='p-2'>{user.fullname}</td>
                <td className='p-2'>{user.contact}</td>
                <td className={'p-2'}>{user.state}</td>
                <td className={'p-2'}>{user.registered_on}</td>
                <td className='p-2'>
                    <i id = {user.user_id} class="p-2 text-md rounded-xl text-red-500 cursor-pointer fa-solid fa-trash" onClick={onDelete}></i>
                    {/* <button id = {user.user_id} className="py-2 px-4 text-md bg-red-500 rounded-xl text-white" onClick={onDelete}>Remove</button> */}
                </td>
            </tr>
        )
    })

    return (
        <div className='self-start'>
            {
                list.length === 0 ?
                <div>
                    <img src='/img/notFound.png'></img>
                    <h2 className='text-center text-white'>No records Found</h2>
                </div>
                : (
                    <table className='styled-table'>
                        <thead>
                            <tr className='bg-[#adcbe3] text-left text-black text-md my-4'>
                                {header}
                            </tr>
                        </thead>
                        <tbody>
                            {showList}
                        </tbody>
                    </table>
                )
            }
            {/* {details} */}
        </div>
    )
}

export default UsersTable