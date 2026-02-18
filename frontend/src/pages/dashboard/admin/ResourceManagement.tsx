import React, { useEffect, useState } from 'react';
import { resourceService, type Resource } from '../../../services/resourceService';
import { userService, type User } from '../../../services/userService';
import { Plus, Search, MoreVertical, Cpu, Users, Building2, Monitor, Loader2, X, Check, Trash2 } from 'lucide-react';

export const ResourceManagement: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    // Form States
    const [labInCharges, setLabInCharges] = useState<User[]>([]);
    const [staffMembers, setStaffMembers] = useState<User[]>([]);
    const [formData, setFormData] = useState<Partial<Resource>>({
        name: '',
        type: 'LAB',
        capacity: 30,
        status: 'ACTIVE',
        lab_in_charge: undefined,
        assigned_staff: undefined
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [data, users] = await Promise.all([
                resourceService.getAll(),
                userService.getAll()
            ]);
            setResources(data);
            setLabInCharges(users.filter(u => u.role === 'LAB_INCHARGE'));
            setStaffMembers(users.filter(u => u.role === 'STAFF'));
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (resource?: Resource) => {
        if (resource) {
            setEditingResource(resource);
            setFormData(resource);
        } else {
            setEditingResource(null);
            setFormData({
                name: '',
                type: 'LAB',
                capacity: 30,
                status: 'ACTIVE',
                lab_in_charge: undefined,
                assigned_staff: undefined
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingResource(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingResource) {
                await resourceService.update(editingResource.id, formData);
            } else {
                await resourceService.create(formData);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save resource', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to decommission this asset?')) return;
        try {
            await resourceService.delete(id);
            await fetchData();
        } catch (error) {
            console.error('Failed to delete resource', error);
        }
    };

    const filteredResources = resources.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'LAB': return <Cpu size={20} />;
            case 'CLASSROOM': return <Users size={20} />;
            case 'EVENT_HALL': return <Building2 size={20} />;
            case 'COMPUTER': return <Monitor size={20} />;
            case 'MEETING_ROOM': return <Users size={20} />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-college-navy tracking-tight italic leading-tight">Asset Management</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Provision, configure, and decommission institutional resources.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-premium flex items-center justify-center gap-2 py-3 px-6 shadow-lg shadow-college-navy/10 active:scale-95 transition-all"
                >
                    Add Resource <Plus size={18} />
                </button>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-50 bg-slate-50/30 p-6 sm:p-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter assets by name or type..."
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
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Synchronizing Asset Registry...</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-50">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resource / Type</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Capacity</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Responsibility</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operational Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {filteredResources.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="whitespace-nowrap px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 border-2 border-white shadow-md transition-all">
                                                    {getIcon(res.type)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-black text-college-navy italic">{res.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.type.replace('_', ' ')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-6">
                                            <div className="text-sm font-bold text-slate-600">
                                                {res.capacity} <span className="text-[10px] text-slate-400 font-black uppercase">Stations</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-6">
                                            <div className="text-xs font-bold text-college-navy">
                                                {res.lab_in_charge_name || res.assigned_staff_name || 'System Managed'}
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {res.lab_in_charge_name ? 'In-Charge' : res.assigned_staff_name ? 'Assigned Staff' : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-6">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] border ${res.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : res.status === 'MAINTENANCE'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-slate-50 text-slate-700 border-slate-100'
                                                }`}>
                                                <div className={`mr-2 h-1 w-1 rounded-full ${res.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                                                    }`} />
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(res)}
                                                className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && filteredResources.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-black text-college-navy italic mb-2">Registry Empty</h3>
                        <p className="text-slate-500 font-medium">No assets matching your query were found in the institutional vault.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-college-navy/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
                        <div className="rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border border-white">
                            <div className="bg-college-navy p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Cpu size={120} />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black italic tracking-tight">
                                            {editingResource ? 'UPDATE ASSET' : 'PROVISION ASSET'}
                                        </h2>
                                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Resource Configuration Module</p>
                                    </div>
                                    <button onClick={handleCloseModal} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Resource Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy focus:border-primary-500 outline-none transition-all"
                                            placeholder="Advanced Physics Lab"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Asset Category</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy focus:border-primary-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="LAB">Laboratory</option>
                                            <option value="CLASSROOM">Classroom</option>
                                            <option value="EVENT_HALL">Event Hall</option>
                                            <option value="COMPUTER">Computing Resource</option>
                                            <option value="MEETING_ROOM">Meeting Room</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Capacity (Units)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.capacity}
                                            onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy focus:border-primary-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Operational Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                            className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy focus:border-primary-500 outline-none transition-all"
                                        >
                                            <option value="ACTIVE">Operational (Active)</option>
                                            <option value="INACTIVE">Decommissioned (Inactive)</option>
                                            <option value="MAINTENANCE">Under Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                        {formData.type === 'LAB' ? 'Assign Lab In-Charge' : 'Assign Faculty Head'}
                                    </label>
                                    <select
                                        value={formData.type === 'LAB' ? formData.lab_in_charge : formData.assigned_staff}
                                        onChange={e => {
                                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                                            if (formData.type === 'LAB') {
                                                setFormData({ ...formData, lab_in_charge: val, assigned_staff: undefined });
                                            } else {
                                                setFormData({ ...formData, assigned_staff: val, lab_in_charge: undefined });
                                            }
                                        }}
                                        className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy focus:border-primary-500 outline-none transition-all"
                                    >
                                        <option value="">System Managed (No Direct Oversight)</option>
                                        {formData.type === 'LAB'
                                            ? labInCharges.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)
                                            : staffMembers.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)
                                        }
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Abort Request
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] btn-premium flex items-center justify-center gap-2 py-4 shadow-xl shadow-primary-600/20 active:scale-95 transition-all"
                                    >
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
                                            <>
                                                {editingResource ? 'Confirm Updates' : 'Initialize Asset'}
                                                <Check size={18} className="ml-1" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
