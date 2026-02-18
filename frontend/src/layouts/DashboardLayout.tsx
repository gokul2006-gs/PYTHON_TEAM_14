import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, LogOut, Bell, User,
    LayoutDashboard, Calendar, BookOpen, Settings, Shield, FileText,
    Search, GraduationCap
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

    const getNavigation = (): SidebarItem[] => {
        switch (user?.role) {
            case 'STUDENT':
                return [
                    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
                    { name: 'My Schedule', href: '/dashboard/student/bookings', icon: Calendar },
                    { name: 'Resource Hub', href: '/dashboard/student/resources', icon: BookOpen },
                ];
            case 'STAFF':
                return [
                    { name: 'Faculty Dashboard', href: '/dashboard/staff', icon: LayoutDashboard },
                    { name: 'Research Bookings', href: '/dashboard/staff/bookings', icon: Calendar },
                    { name: 'Department Assets', href: '/dashboard/staff/resources', icon: BookOpen },
                    { name: 'Approval Requests', href: '/dashboard/staff/approvals', icon: Shield },
                ];
            case 'LAB_INCHARGE':
                return [
                    { name: 'Center Overview', href: '/dashboard/lab-incharge', icon: LayoutDashboard },
                    { name: 'Lab Timeline', href: '/dashboard/lab-incharge/schedule', icon: Calendar },
                    { name: 'Pending Access', href: '/dashboard/lab-incharge/approvals', icon: FileText },
                    { name: 'Asset Management', href: '/dashboard/lab-incharge/resources', icon: Settings },
                ];
            case 'ADMIN':
                return [
                    { name: 'System Control', href: '/dashboard/admin', icon: LayoutDashboard },
                    { name: 'Global Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
                    { name: 'User Directory', href: '/dashboard/admin/users', icon: User },
                    { name: 'Master Resources', href: '/dashboard/admin/resources', icon: BookOpen },
                    { name: 'Security Center', href: '/dashboard/admin/approvals', icon: Shield },
                    { name: 'Audit Infrastructure', href: '/dashboard/admin/audit', icon: FileText },
                ];
            default:
                return [];
        }
    };

    const navigation = getNavigation();

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Desktop Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 transform bg-college-navy text-white transition-transform duration-300 ease-in-out lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col px-6 py-8">
                    {/* Brand */}
                    <div className="mb-12 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-lg">
                            <GraduationCap size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight">CAMPUS<span className="text-primary-400">CORE</span></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300/60">Institutional</span>
                        </div>
                        <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                                        isActive
                                            ? "bg-white text-college-navy shadow-lg shadow-black/20"
                                            : "text-primary-100/70 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-college-navy" : "text-primary-300/40 group-hover:text-white")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Area */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white font-bold">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate">{user?.name}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300/60 truncate">{user?.role}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:ml-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white/80 px-8 backdrop-blur-md border-b border-slate-200/60">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search organization..."
                                className="h-11 w-80 rounded-xl bg-slate-100 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all border-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 transition-all hover:border-primary-500 hover:text-primary-600 hover:shadow-lg hover:shadow-primary-500/10"
                            >
                                <Bell size={20} />
                                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>
                            <div className="absolute right-0 top-14 w-80">
                                <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
                            </div>
                        </div>

                        <div className="h-11 w-[1px] bg-slate-200 mx-2" />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{user?.role}</span>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                                {user?.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};
