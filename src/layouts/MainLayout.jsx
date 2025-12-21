import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
            <Sidebar />
            <main className="flex-1 overflow-auto relative">
                <div className="relative z-10 p-8 h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
