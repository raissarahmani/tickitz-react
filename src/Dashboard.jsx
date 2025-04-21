import React from 'react'
import { Outlet } from 'react-router';
import Header from "./components/Header";
import Footer from "./components/Footer";

function Dashboard() {
  return (
    <div className='w-full'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Dashboard
