import React from 'react'
import {NavLink} from 'react-router-dom'

const NavBar = (props) => {

    const links = props.links.map((items)=>{
        return (
            <li className="p-4">
                <NavLink to={items.route} className='hover:text-[#ffff00] font-bold' activeStyle={{color:'yellow',fontWeight: 'bolder'}}>{items.name}</NavLink>
            </li>
        )
    })

    return (
    <div className="bg-[#4b86b4]">
        <nav className="text-white text-2xl flex justify-between m-auto p-4">
            <h1 className='p-4 font-bold'>Complaint Management System</h1>
            <ul className="flex justify-between">
                {links}
            </ul>
        </nav>
    </div>
    )
}

export default NavBar