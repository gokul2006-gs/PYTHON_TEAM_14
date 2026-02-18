import React, { useState, useEffect } from 'react';
import { Shield, Search, MoreVertical, Loader2, AlertCircle, UserPlus, X, Plus, Check } from 'lucide-react';
import { userService, type User } from '../../../services/userService';

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    // Enrollment Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'CampusPassword123', // Default institutional password
        role: 'STUDENT',
        department: '',
        roll_number: '',
        employee_id: '',
        phone: ''
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to synchronize identity registry. Please verify connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await userService.enroll(formData);
            setFormData({
                name: '', email: '', password: 'CampusPassword123',
                role: 'STUDENT', department: '', roll_number: '',
                employee_id: '', phone: ''
            });
            setIsAddingUser(false);
            fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to enroll user into the system.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic leading-tight">Identity Registry</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Manage institutional user access and authorization protocols.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchUsers}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-college-navy hover:shadow-lg transition-all"
                    >
                        <Loader2 className={isLoading ? 'animate-spin' : ''} size={20} />
                    </button>
                    <button
                        onClick={() => setIsAddingUser(!isAddingUser)}
                        className={`btn-premium flex items-center justify-center gap-2 py-3 px-6 shadow-lg shadow-college-navy/10 active:scale-95 transition-all ${isAddingUser ? 'bg-rose-600 hover:bg-rose-700' : ''}`}
                    >
                        {isAddingUser ? (
                            <><X size={18} /> Cancel Enrollment</>
                        ) : (
                            <><UserPlus size={18} /> Enroll New User</>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Enrollment Form */}
            {isAddingUser && (
                <div className="rounded-[2.5rem] border-2 border-primary-100 bg-primary-50 px-8 py-10 shadow-xl shadow-primary-500/5 animate-fade-in-down">
                    <form onSubmit={handleEnroll} className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-black text-college-navy italic">Primary Authorization Data</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Legal Name</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-white bg-white/50 p-4 text-sm font-bold focus:border-primary-500 outline-none transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Institutional Email</label>
                                <input
                                    type="email" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-white bg-white/50 p-4 text-sm font-bold focus:border-primary-500 outline-none transition-all"
                                    placeholder="gokul@campus.edu"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Access Tier</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-white bg-white/50 p-4 text-sm font-bold focus:border-primary-500 outline-none cursor-pointer"
                                >
                                    <option value="STUDENT">Student (End-User)</option>
                                    <option value="STAFF">Faculty (Supervisor)</option>
                                    <option value="LAB_INCHARGE">Lab Manager (Admin Unit)</option>
                                    <option value="ADMIN">System Admin (Root)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Department</label>
                                <input
                                    type="text" required
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-white bg-white/50 p-4 text-sm font-bold focus:border-primary-500 outline-none"
                                    placeholder="CSE / ECE / IT"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Identifier (Roll/Emp ID)</label>
                                <input
                                    type="text" required
                                    value={formData.role === 'STUDENT' ? formData.roll_number : formData.employee_id}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        roll_number: formData.role === 'STUDENT' ? e.target.value : '',
                                        employee_id: formData.role !== 'STUDENT' ? e.target.value : ''
                                    })}
                                    className="w-full rounded-2xl border-2 border-white bg-white/50 p-4 text-sm font-bold focus:border-primary-500 outline-none"
                                    placeholder="Unique ID"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Default Key</label>
                                <input
                                    type="text" readOnly
                                    value={formData.password}
                                    className="w-full rounded-2xl border-2 border-white bg-slate-100 p-4 text-sm font-bold text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-10 py-4 text-sm font-black text-white hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                            >
                                <Check size={18} /> Process Initialization
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Accessing Identity Vault...</p>
                        </div>
                    ) : error && !isAddingUser ? (
                        <div className="py-24 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
                            <p className="text-rose-600 font-bold">{error}</p>
                            <button onClick={fetchUsers} className="mt-4 text-sm font-black text-primary-600 uppercase hover:underline">Retry Connection</button>
                        </div>
                    ) : (
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
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-black text-college-navy italic">{user.username}</div>
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
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] border ${user.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                <div className={`mr-2 h-1 w-1 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                {user.status === 'ACTIVE' ? 'Authorized' : 'Deactivated'}
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
                    )}
                </div>

                {!isLoading && !error && filteredUsers.length === 0 && (
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

