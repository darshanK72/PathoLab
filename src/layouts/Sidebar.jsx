import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCircle, FlaskConical, ClipboardList, Settings, ChevronDown, ChevronRight, ShieldCheck, Layout } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState('Settings'); // Default expanded for visibility

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/patients', label: 'Patients', icon: UserCircle },
        { path: '/tests', label: 'Tests', icon: ClipboardList },
        {
            label: 'Settings',
            icon: Settings,
            path: '/settings',
            children: [
                { path: '/settings/report', label: 'Report Format', icon: Layout },
                { path: '/settings/general', label: 'General', icon: Settings },
                { path: '/settings/security', label: 'Security', icon: ShieldCheck },
            ]
        },
    ];

    const toggleMenu = (label) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col text-gray-700 shadow-sm z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-lg shadow-teal-500/10">
                        <FlaskConical className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                        PathoLab
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="px-3 mb-6">
                    <Link
                        to="/case-entry"
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all font-medium text-sm group"
                    >
                        <FlaskConical className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Create New Case</span>
                    </Link>
                </div>

                {navItems.map((item) => {
                    const isActive = item.path === location.pathname || (item.children && item.children.some(child => child.path === location.pathname));
                    const isExpanded = expandedMenu === item.label;

                    return (
                        <div key={item.label}>
                            <div
                                onClick={() => item.children ? toggleMenu(item.label) : null}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                                    isActive && !item.children
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {item.children ? (
                                    // Parent Item (with Toggle)
                                    <div className="flex items-center gap-3 w-full">
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        )} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>
                                ) : (
                                    // Standard Link Item
                                    <Link to={item.path} className="flex items-center gap-3 w-full">
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                        )} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </div>

                            {/* Sub-menu */}
                            {item.children && isExpanded && (
                                <div className="ml-9 space-y-1 mt-1">
                                    {item.children.map((child) => {
                                        const isChildActive = location.pathname === child.path;
                                        return (
                                            <Link
                                                key={child.path}
                                                to={child.path}
                                                className={cn(
                                                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                                                    isChildActive
                                                        ? "text-blue-700 bg-blue-50 font-medium"
                                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                                )}
                                            >
                                                {child.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile Snippet (Bottom) */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-sm border border-gray-100">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Dr. S. Kumar</p>
                        <p className="text-xs text-gray-500 truncate">Super Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
