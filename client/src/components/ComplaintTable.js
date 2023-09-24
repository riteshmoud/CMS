import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DescriptionModal from './DescriptionModal'
import './admin/style/table.css'

const ComplaintTable = (props) => {

    const header = props.headings.map((item)=>{
        return (
            <th className='p-4'>{item}</th>
        )
    })

    const [list,setList] = useState([])
    const [details,setDetails] = useState('')

    useEffect(()=>{
        const fetch_complaints = async ()=>{
            if(props.user === 'user'){
                await axios.get('http://localhost:3500/fetch_complaints')
                .then((res)=>{
                    if(window.location.pathname === '/user_login/fetch_complaints/pending'){
                        setList(res.data.pending)
                    }
                    else if(window.location.pathname === '/user_login/fetch_complaints/completed'){
                        setList(res.data.completed)
                    }
                    else if(window.location.pathname === '/user_login/fetch_complaints/total'){
                        setList(res.data.total)
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
            }else{
                await axios.get('http://localhost:3500/fetch_complaints/admin')
                .then((res)=>{
                    if(window.location.pathname === '/admin_login/fetch_complaints/pending'){
                        setList(res.data.pending)
                    }
                    else if(window.location.pathname === '/admin_login/fetch_complaints/completed'){
                        setList(res.data.completed)
                    }
                    else if(window.location.pathname === '/admin_login/fetch_complaints/total'){
                        setList(res.data.total)
                    }
                })
                .catch((err)=>{

                })
            }
        }
        fetch_complaints()
        console.log(list);
    },[details])

    const onViewClick = (e) => {
        console.log(list[e.target.id]);
        if(props.user === 'user'){
            return (
                setDetails(<DescriptionModal comp={list[e.target.id]} fun={setDetails} user = 'user'/>)
            )
        }else{
            return (
                setDetails(<DescriptionModal comp={list[e.target.id]} fun={setDetails} user = 'admin'/>)
            )
        }
    }

    const addUser = (comp) => {
        if(props.user === 'admin'){
            return <td className='p-4'>{comp.user}</td>
        }
    }

    const addRemarks = (comp) => {
        if(props.user === 'user'){
            return <td className='p-4'>{comp.remarks}</td>
        }
    }

    const showList = list.map((comp,idx)=>{
        const status = comp.status === 'Pending' ? 'bg-red-500 text-white' : 'bg-green-500 text-white' 
        return(
            <tr className='bg-[#e7eff6] text-left text-black text-md my-4'>
                <td className='p-4'>{comp.comp_id}</td>
                {addUser(comp)}
                <td className='p-4'>{comp.category}</td>
                <td className='p-4'>{comp.sub_category}</td>
                <td className='p-4'>{comp.date_time}</td>
                <td className={`p-4 ${status}`}>{comp.status}</td>
                {addRemarks(comp)}
                <td className='p-4'>
                    {/* <i id = {idx} class="p-2 text-md rounded-xl text-red-500 cursor-pointer fa-solid fa-trash" onClick={onViewClick}></i> */}
                    <button id = {idx} className="py-2 px-4 text-md bg-[#1f306e] rounded-xl text-white" onClick={onViewClick}>View</button>
                </td>
            </tr>
        )
    })

    return (
        <div className='self-start py-6'>
            {
                list.length === 0 ?
                <div>
                    <img src='/img/notFound.png'></img>
                    <h2 className='text-center text-white'>No records Found</h2>
                </div>
                : 
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
            }
            {details}
        </div>
    )
}

export default ComplaintTable