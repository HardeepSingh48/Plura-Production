import Link from 'next/link'
import React from 'react'


const Unauthorized = () => {
  return (
    <div className='p-4 text-center w-screen flex justify-center items-center flex-col'>
        <h1 className='text-3xl md:text-6xl'> Unauthorized access!</h1>
        <p>Please contact support or your agency owner to get access</p>
        <Link
        href="/"
        className='mt-4 bg-primary p-2'>
            Back to home
        </Link>
    </div>
  )
}

export default Unauthorized