import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Dashboard = (props) => {

    let status = {pending: 0,completed: 0,total: 0}
    const [comp_status,setCompStatus] = useState(status)

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    useEffect(()=>{
        const fetchComp = async () => {
            if(props.user === 'user'){
                await axios.get('http://localhost:3500/fetch_complaints')
                .then((res)=>{
                    status = {
                        pending: res.data.pending.length,
                        completed: res.data.completed.length,
                        total: res.data.total.length
                    }
                    setCompStatus(status)
                })
                .catch((err)=>{
                    console.log(err);
                })
            }else{
                await axios.get('http://localhost:3500/fetch_complaints/admin')
                .then((res)=>{
                    status = {
                        pending: res.data.pending.length,
                        completed: res.data.completed.length,
                        total: res.data.total.length
                    }
                    setCompStatus(status)
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
        }
        fetchComp()
    },[])

    return (
        <div className='bg-[#1f2937] rounded-xl p-2 min-w-[70%]'>
            <div className="p-4 text-xl text-white font-bold flex justify-between items-center m-2 bg-[#111827] rounded-xl">
                {comp_status.pending} Pending Complaints 
                <Link to={`/${props.user}_login/fetch_complaints/pending`}>
                    <button id = "pending" className="py-2 px-4 text-md bg-[#1f306e] rounded-xl text-white">View</button>
                </Link>
            </div>
            <div className="p-4 text-xl text-white font-bold flex justify-between items-center m-2 bg-[#111827] rounded-xl">
                {comp_status.completed} Complaints Resolved
                <Link to={`/${props.user}_login/fetch_complaints/completed`}>
                    <button id = "completed" className="py-2 px-4 text-md bg-[#1f306e] rounded-xl text-white">View</button>
                </Link>
            </div>
            <div className="p-4 text-xl text-white font-bold flex justify-between items-center m-2 bg-[#111827] rounded-xl">
                {comp_status.total} Total Complaints 
                <Link to={`/${props.user}_login/fetch_complaints/total`}>
                    <button id = "total" className="py-2 px-4 text-md bg-[#1f306e] rounded-xl text-white">View</button>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard