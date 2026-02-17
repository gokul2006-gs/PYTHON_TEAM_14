import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, LogOut, Bell, User,
    LayoutDashboard, Calendar, BookOpen, Settings, Shield, FileText
} from 'lucide-react';
import { cn } from '../utils/cn';
import { NotificationCenter } from '../components/common/NotificationCenter';

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

export const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Define navigation based on role
    const getNavigation = (): SidebarItem[] => {
        switch (user?.role) {
            case 'student':
                return [
                    { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
                    { name: 'My Bookings', href: '/dashboard/student/bookings', icon: Calendar },
                    { name: 'Resources', href: '/dashboard/student/resources', icon: BookOpen },
                ];
            case 'faculty':
                return [
                    { name: 'Dashboard', href: '/dashboard/faculty', icon: LayoutDashboard },
                    { name: 'My Bookings', href: '/dashboard/faculty/bookings', icon: Calendar },
                    { name: 'Resources', href: '/dashboard/faculty/resources', icon: BookOpen },
                    { name: 'Approvals', href: '/dashboard/faculty/approvals', icon: FileText },
                ];
            case 'lab_in_charge':
                return [
                    { name: 'Dashboard', href: '/dashboard/lab-in-charge', icon: LayoutDashboard },
                    { name: 'Lab Schedule', href: '/dashboard/lab-in-charge/schedule', icon: Calendar },
                    { name: 'Approvals', href: '/dashboard/lab-in-charge/approvals', icon: FileText },
                    { name: 'Manage Resources', href: '/dashboard/lab-in-charge/resources', icon: Settings },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
                    { name: 'All Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
                    { name: 'Users', href: '/dashboard/admin/users', icon: User },
                    { name: 'Resources', href: '/dashboard/admin/resources', icon: BookOpen },
                    { name: 'Approvals', href: '/dashboard/admin/approvals', icon: Shield },
                    { name: 'Audit Logs', href: '/dashboard/admin/audit', icon: FileText },
                ];
            default:
                return [];
        }
    };

    const navigation = getNavigation();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar (Mobile) */}
            <header className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-ml-2 p-2 text-slate-500 hover:text-slate-600 focus:outline-none"
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        Campus<span className="text-indigo-600">Resource</span>
                    </div>

                    <div className="relative flex items-center gap-4">
                        <button
                            type="button"
                            className="text-slate-500 hover:text-slate-600 relative"
                            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        >
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        {/* Notification Dropdown (Mobile position adjusted) */}
                        <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)]">
                            <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
                        </div>

                        <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar - Desktop */}
            <div className={cn(
                "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:flex",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                                <LayoutDashboard size={18} />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900">
                                Campus<span className="text-indigo-600">Resource</span>
                            </span>
                        </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                                                        isActive
                                                            ? "bg-indigo-50 text-indigo-600"
                                                            : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-6 w-6 shrink-0 transition-colors",
                                                            isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>

                            <li className="mt-auto">
                                {/* Desktop Notification Trigger */}
                                <div className="mb-4 hidden lg:block relative">
                                    <button
                                        onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                                        className="flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                                    >
                                        <div className="relative">
                                            <Bell className="h-6 w-6 shrink-0 text-slate-400" />
                                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                        </div>
                                        Notifications
                                    </button>
                                    {/* Notification Dropdown (Desktop position) */}
                                    <div className="absolute bottom-12 left-0 w-80 z-50">
                                        <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-slate-900 border-t border-slate-100">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <User size={16} />
                                    </div>
                                    <span className="sr-only">Your profile</span>
                                    <div className="flex flex-col">
                                        <span aria-hidden="true">{user?.name}</span>
                                        <span className="text-xs font-normal text-slate-500 capitalize">{user?.role.replace(/_/g, ' ')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="-mx-2 mt-2 flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-red-600" aria-hidden="true" />
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <main className="lg:pl-72">
                <div className="px-4 py-10 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};
