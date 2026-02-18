import React, { useEffect, useState } from 'react';
import { resourceService, type Resource } from '../../services/resourceService';
import { Loader2, Monitor, Users, Building2, Cpu, ArrowRight, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export const ResourceList: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'LAB' | 'CLASSROOM' | 'EVENT_HALL' | 'COMPUTER' | 'MEETING_ROOM'>('all');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await resourceService.getAll();
                setResources(data);
            } catch (error) {
                console.error('Failed to fetch resources', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    const filteredResources = resources.filter(
        (res) => filter === 'all' || res.type === filter
    );

    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'LAB': return <Cpu className="h-6 w-6 text-primary-600" />;
            case 'CLASSROOM': return <Users className="h-6 w-6 text-emerald-600" />;
            case 'EVENT_HALL': return <Building2 className="h-6 w-6 text-orange-600" />;
            case 'COMPUTER': return <Monitor className="h-6 w-6 text-blue-600" />;
            case 'MEETING_ROOM': return <Users className="h-6 w-6 text-purple-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-1">
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-black text-college-navy tracking-tight italic leading-tight">Resource Catalog</h1>
                    <p className="text-slate-500 font-medium italic mt-1 text-sm sm:text-base">Select an asset to book for your research or academic needs.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                    {['all', 'LAB', 'CLASSROOM', 'EVENT_HALL', 'COMPUTER', 'MEETING_ROOM'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={`rounded-xl px-3 sm:px-4 py-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t
                                ? 'bg-college-navy text-white shadow-lg shadow-college-navy/20'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-college-navy'
                                }`}
                        >
                            {t.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                    <Link
                        to={`/dashboard/${role}/resources/${resource.id}`}
                        key={resource.id}
                        className="group relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div className="rounded-2xl bg-slate-50 p-4 transition-colors group-hover:bg-primary-50">
                                {getIcon(resource.type)}
                            </div>
                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${resource.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                                }`}>
                                <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {resource.status}
                            </div>
                        </div>

                        <h3 className="mb-3 text-xl font-bold text-college-navy tracking-tight transition-colors group-hover:text-primary-600 italic">
                            {resource.name}
                        </h3>

                        <div className="mb-8 flex items-center gap-6 text-sm font-bold text-slate-500">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-slate-400" />
                                {resource.capacity} Seats
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor size={16} className="text-slate-400" />
                                Interactive
                            </div>
                        </div>

                        <div className="flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-college-navy group-hover:bg-primary-600 group-hover:shadow-lg group-hover:shadow-primary-600/20">
                            Schedule Access <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}

                {filteredResources.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-college-navy mb-2 italic">Nothing found matching your criteria</h3>
                        <p className="text-slate-500">Try adjusting your filters to find suitable resources.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
