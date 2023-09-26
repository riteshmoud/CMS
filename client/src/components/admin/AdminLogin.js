import React from 'react'
import Sidebar from '../Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../users/Dashboard';
import ComplaintTable from '../ComplaintTable';
import UsersTable from './UsersTable';
import AddDetails from './AddDetails';
import ChangePassword from '../users/ChangePassword';

const AdminLogin = () => {

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

    const adminLogout = async (e) => {
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
            <div className='bg-[#1f2937] h-full flex flex-col justify-between '>
            <Sidebar links={[
                    {name:'Dashboard',route:'/admin_login/dashboard'},
                    {name:'Users',route:'/admin_login/show_users'},
                    {name:'Add Details',route:'/admin_login/add_details'},
                    {name:'Change Password',route:'/admin_login/change_password'},
            ]}/>
            <button className="px-4 py-2 text-lg bg-red-600 text-white self-center hover:bg-red-500 rounded-xl w-[80%] m-2" onClick={adminLogout}>
                Logout
            </button>
            </div>
           
            <div className='grow flex items-center justify-center overflow-auto relative'>
                {/* <div className="flex justify-center items-center min-w-[70%] self-start py-6"> */}
                    <Switch>
                        <Route path='/admin_login/dashboard' exact component={()=>(<Dashboard user='admin'/>)}/>
                        <Route path='/admin_login/fetch_complaints' component={() => (<ComplaintTable headings={['ID','User','Category','Sub Category','Date/Time','Status','']} user='admin'/>)}/>
                        <Route path='/admin_login/show_users' component={() => (<UsersTable headings={['User ID','Email','Full Name','Contact','State','Registered On','']} user='admin'/>)}/>
                        <Route path='/admin_login/add_details' component={AddDetails}/>
                        <Route path='/admin_login/change_password' exact component={()=>(<ChangePassword user = 'admin'/>)}/>
                    </Switch>
                {/* </div> */}
            </div>
        </div>
        </BrowserRouter>
    )
}

export default AdminLogin