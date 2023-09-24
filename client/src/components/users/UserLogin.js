import React from 'react'
import Sidebar from '../Sidebar'
import Dashboard from './Dashboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import LodgeComplaint from './LodgeComplaint';
import { useEffect } from 'react';
import axios from 'axios';
import ComplaintTable from '../ComplaintTable';
import UserProfile from './UserProfile';
import ChangePassword from './ChangePassword';

const UserLogin = () => {

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    useEffect(()=>{
        const auth = async () => {
            await axios.get('http://localhost:3500/api/auth_session')
            .then((res)=>{
                console.log(res);
                if(res.status === 200){
                    toast.success("Login Successful !", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
            .catch((err)=>{
                toast.error(err.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                console.log(err);
                window.location.pathname = '/'
            })
        }
        auth()
    },[])

    const userLogout = async (e) => {
        await axios.get('http://localhost:3500/logout')
        .then((res)=>{
            window.location.pathname = '/'
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        
        <BrowserRouter>
        <div className="h-screen flex">
            <div className="bg-[#1f2937] h-full flex flex-col justify-between ">
                <Sidebar links={[
                        {name:'Dashboard',route:'/user_login/dashboard'},
                        {name:'Lodge Complaint',route:'/user_login/lodge_complaint'},
                        {name:'Change Password',route:'/user_login/change_password'},
                        {name:'My Account',route:'/user_login/my_account'},
                ]}/>
                <button className="px-4 py-2 text-lg bg-red-500 text-white self-center rounded-xl w-full m-2" onClick={userLogout}>
                    Logout
                </button>
            </div>
            <div className='grow flex items-center justify-center overflow-auto relative'>
                {/* <div className="flex justify-center items-center min-w-[70%] py-6"> */}
                    <Switch>
                        <Route path='/user_login/dashboard' exact component={()=>(<Dashboard user='user'/>)}/>
                        <Route path='/user_login/lodge_complaint' exact component={LodgeComplaint}/>
                        <Route path='/user_login/change_password' exact component={()=>(<ChangePassword user='user'/>)}/>
                        <Route path='/user_login/my_account' exact component={UserProfile}/>
                        <Route path='/user_login/fetch_complaints' component={() => (<ComplaintTable headings={['ID','Category','Sub Category','Date/Time','Status','Remarks','']} user='user'/>)}/>
                    </Switch>
                {/* </div>    */}
            </div>
        </div>
        </BrowserRouter>
    )
}

export default UserLogin