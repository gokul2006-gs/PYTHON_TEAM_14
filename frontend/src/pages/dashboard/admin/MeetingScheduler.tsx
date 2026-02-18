import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { Loader2, Calendar, Clock, Users, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface User {
    id: number;
    username: string;
    role: string;
}

interface Resource {
    id: number;
    name: string;
}

export const MeetingScheduler: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        participants: [] as number[],
        date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '10:00:00',
        end_time: '11:00:00',
        location: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, resourcesRes] = await Promise.all([
                    api.get('/users/'),
                    api.get('/resources/')
                ]);
                setUsers(usersRes.data);
                setResources(resourcesRes.data);
            } catch (error) {
                console.error('Failed to fetch scheduler data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/meetings/', formData);
            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                participants: [],
                date: format(new Date(), 'yyyy-MM-dd'),
                start_time: '10:00:00',
                end_time: '11:00:00',
                location: ''
            });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Failed to schedule meeting', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-college-navy italic">Meeting Orchestration</h2>
                <p className="text-slate-500 font-medium italic">Schedule institutional sessions for staff and students.</p>
            </div>

            {success && (
                <div className="mb-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-center gap-3 text-emerald-800 font-bold text-sm animate-bounce">
                    <CheckCircle2 size={20} />
                    Meeting scheduled and notifications dispatched!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Session Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Annual Departmental Review"
                        className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 px-4 text-sm font-bold text-college-navy placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select
                                required
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy outline-none"
                            >
                                <option value="">Select Venue</option>
                                {resources.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Commences</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="time"
                                required
                                value={formData.start_time}
                                onChange={e => setFormData({ ...formData, start_time: e.target.value + ':00' })}
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Concluding</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="time"
                                required
                                value={formData.end_time}
                                onChange={e => setFormData({ ...formData, end_time: e.target.value + ':00' })}
                                className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">Participants</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-4 text-slate-300" size={18} />
                        <select
                            multiple
                            required
                            value={formData.participants.map(String)}
                            onChange={e => {
                                const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                                setFormData({ ...formData, participants: values });
                            }}
                            className="block w-full rounded-2xl border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-college-navy min-h-[120px] outline-none"
                        >
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    [{u.role}] {u.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 font-bold px-1 italic">Cmd/Ctrl + Click to select multiple scholars.</p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-premium flex w-full items-center justify-center gap-2 py-4"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                        <>
                            Schedule Session
                            <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
