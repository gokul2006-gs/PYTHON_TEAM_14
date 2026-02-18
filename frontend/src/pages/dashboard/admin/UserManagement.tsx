import React, { useState } from 'react';
import { User, Shield, Search, MoreVertical } from 'lucide-react';

// Mock User Data
const MOCK_USERS = [
    { id: '1', name: 'John Doe', email: 'john@student.campus.edu', role: 'student', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@student.campus.edu', role: 'student', status: 'active' },
    { id: '3', name: 'Dr. Alan Grant', email: 'alan@faculty.campus.edu', role: 'faculty', status: 'active' },
    { id: '4', name: 'Lab Tech Sarah', email: 'sarah@lab.campus.edu', role: 'lab_in_charge', status: 'active' },
    { id: '5', name: 'Admin User', email: 'admin@campus.edu', role: 'admin', status: 'active' },
];

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users] = useState(MOCK_USERS);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic leading-tight">Identity Registry</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Manage institutional user access and authorization protocols.</p>
                </div>
                <button className="btn-premium flex items-center justify-center gap-2 py-3 px-6 shadow-lg shadow-college-navy/10 active:scale-95 transition-all">
                    Register User <User size={18} />
                </button>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-50 bg-slate-50/30 p-6 sm:p-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or institutional email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-2xl border-2 border-slate-100 bg-white py-3.5 pl-12 pr-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="min-w-full divide-y divide-slate-50">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Identity</th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clearance Role</th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Status</th>
                                <th scope="col" className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="whitespace-nowrap px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 font-black text-lg border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-black text-college-navy italic">{user.name}</div>
                                                <div className="text-xs font-medium text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-6">
                                        <div className="flex items-center text-xs font-black text-slate-600 uppercase tracking-widest bg-slate-100/50 py-1.5 px-3 rounded-lg w-fit">
                                            <Shield size={12} className="mr-2 text-primary-500" />
                                            {user.role.replace(/_/g, ' ')}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-6">
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700 border border-emerald-100">
                                            <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                            Authorized
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-6 text-right">
                                        <button className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-college-navy transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-black text-college-navy italic mb-2">No Matches Found</h3>
                        <p className="text-slate-500 font-medium">No users found matching your current refinement parameters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
