import React from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';

function Layout({children}) {
    return (
        <>
            <Navbar/>
            <Sidebar/>
            <div>
                {children}
            </div>
            <Footer/>
        </>
    )
}

export default Layout;