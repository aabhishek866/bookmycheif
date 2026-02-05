import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/*------ Left Section ---------*/}
        <div>
            <img className='mb-5 w-20 h-20 rounded-xl' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Discover the art of fine dining with a personal chef. Book now for a gourmet experience in your own home. Exceptional cuisine, just a reservation away</p>
        </div>

        {/*------ Center Section ---------*/}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About us</Link>
                <Link to={'/contact'}>Contact us</Link>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/*------ Right Section ---------*/}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <Link to ={`tel:8928335794`} className='hover:text-blue-600'>89823 35794</Link>
                <Link to ={`mailto:singhabhishek8525@gmail.com`} className='hover:text-blue-600'>singhabhishek8525@gmail.com</Link>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ JasminRoy - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
