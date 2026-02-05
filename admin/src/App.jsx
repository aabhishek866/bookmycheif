import React, { useContext } from 'react'
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointment from './pages/Admin/AllApointment';
import AddDoctor from './pages/Admin/AddDoctor';
import ChefsList from './pages/Admin/ChefsList';
import { DoctorContext } from './context/ChefContext';
import DoctorDashboard from './pages/Chef/DoctorDashboard';
import DoctorAppointments from './pages/Chef/DoctorAppointments';
import DoctorProfile from './pages/Chef/DoctorProfile';

const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)


  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-center'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-booking' element={<AllApointment/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/chef-list' element={<ChefsList/>} />
          <Route path='/chef-dashboard' element={<DoctorDashboard/>} />
          <Route path='/chef-booking' element={<DoctorAppointments/>} />
          <Route path='/chef-profile' element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
