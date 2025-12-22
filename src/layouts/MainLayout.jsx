import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const location = useLocation();

    // Pages that manage their own scrolling (e.g. Settings) should disable layout scroll
    const shouldDisableScroll = location.pathname.includes('/settings');

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
            <div className="no-print">
                <Sidebar />
            </div>
            <main className={`flex-1 relative ${shouldDisableScroll ? 'overflow-hidden' : 'overflow-auto'}`}>
                <div className="relative z-10 p-4 h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
