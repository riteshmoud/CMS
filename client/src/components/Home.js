import React from 'react'
import UserSignIn from './users/SignIn'
import Registration from './users/Registration'
import AdminSignIn from './admin/SignIn'
import {BrowserRouter,Route} from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import NavBar from './NavBar'

const Home = () => {

    // IMPORTANT when using sessions and cookies
    axios.defaults.withCredentials = true

    useEffect(()=>{
        const auth = async () => {
            const res = await axios.get('http://localhost:3500/api/auth_session')
            console.log(res);
            if(res.status === 200){
                window.location.pathname = `/${res.data}_login/dashboard`
            }
        }
        auth()
    },[])

    return (
        <BrowserRouter>
        
            <div className='h-screen flex flex-col'>
                <div className='m-[2rem] bg-[#1f2937] min-w-[70%] rounded-full self-center'>
                    <NavBar links={[
                        {name:'Login',route:'/users/SignIn'},
                        {name:'Registration',route:'/users/Registration'},
                        {name:'Admin',route:'/admin/SignIn'}
                    ]}/>
                </div>
                <div className="flex justify-center items-center" style={{flexGrow: '1'}}>
                        <div>
                            <Route path='/' exact component={UserSignIn}/>
                            <Route path='/users/SignIn' exact component={UserSignIn}/>
                            <Route path='/users/Registration' exact component={Registration}/>
                            <Route path='/admin/SignIn' exact component={AdminSignIn}/>
                        </div>
                </div>
            </div>

        </BrowserRouter>
    )
}

export default Home