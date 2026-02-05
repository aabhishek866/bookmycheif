

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Chefs from './pages/Chefs'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chef' element={<Chefs />} />
        <Route path='/chef/:speciality' element={<Chefs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-booking' element={<MyAppointments />} />
        <Route path='/booking/:docId' element={<Appointment />} />
        
      </Routes>
      <Footer />
    </div>
  )
}

export default App
