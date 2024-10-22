import Header from './header/Header'
import Footer from './footer/Footer'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Customize from './customize/Customize'
import Orders from './orders/Orders'
import Manufacturers from './manufacturers/Manufacturers'
import Profile from './profile/Profile'

function AdminUI() {
  return (
    <div className='bg-slate-200'>
      <Header />
        <div className='ml-[11%] mr-[10%]'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
      <Footer />
    </div>
  )
}

export default AdminUI