import React from 'react'

const Button = ({value}) => {
    return (
        <input 
        type="submit" 
        className='border-none w-full p-2 text-lg w-[100%] bg-blue-800 hover:cursor-pointer hover:bg-blue-500 font-medium rounded-xl text-white' 
        value={value}/>
    )
}

export default Button