import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Home from './Home'
import UserLogin from './users/UserLogin'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComplaintTable from './ComplaintTable';
import AdminLogin from './admin/AdminLogin';

const App = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/user_login/dashboard' exact component={UserLogin}/>
                <Route path='/admin_login/dashboard' exact component={AdminLogin}/>
                <Route path='/' component={Home}/>
            </Switch>
            <ToastContainer/>
        </BrowserRouter>
    )
}

export default App