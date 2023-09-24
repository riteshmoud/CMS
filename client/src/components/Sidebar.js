import React from 'react'
import {NavLink} from 'react-router-dom'

const Sidebar = (props) => {

    const links = props.links.map((items)=>{
        return (
            <li className="p-4">
                <NavLink to={items.route} className='hover:text-[#ffff00] font-bold' activeStyle={{color:'yellow',fontWeight: 'bolder'}}>{items.name}</NavLink>
            </li>
        )
    })

    return (
    <div className='h-[100%]'>
        <nav className="text-white text-xl flex flex-col justify-center items-stretch m-auto p-2">
            <h1 className='p-4 font-bold'>Complaint Management System</h1>
            <ul className="flex flex-col justify-between">
                {links}
            </ul>
        </nav>
    </div>
    )
}

export default Sidebar