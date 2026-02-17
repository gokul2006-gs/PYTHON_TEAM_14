import React, { useEffect, useState } from 'react';
import { resourceService, type Resource } from '../../services/resourceService';
import { Loader2, Monitor, MapPin, Users, Settings } from 'lucide-react';

export const ResourceList: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'lab' | 'venue' | 'equipment'>('all');

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
            case 'lab': return <Monitor className="h-6 w-6 text-indigo-600" />;
            case 'venue': return <Users className="h-6 w-6 text-purple-600" />;
            case 'equipment': return <Settings className="h-6 w-6 text-orange-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Campus Resources</h1>
                <div className="flex gap-2">
                    {['all', 'lab', 'venue', 'equipment'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${filter === t
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                    <div
                        key={resource.id}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div className="rounded-lg bg-slate-50 p-3 group-hover:bg-indigo-50">
                                {getIcon(resource.type)}
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${resource.status === 'active'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                }`}>
                                {resource.status}
                            </span>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                            {resource.name}
                        </h3>

                        <div className="mb-6 space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {resource.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                Capacity: {resource.capacity}
                            </div>
                        </div>

                        <button
                            className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 group-hover:bg-indigo-600"
                        >
                            Check Availability
                        </button>
                    </div>
                ))}

                {filteredResources.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        No resources found matching your filter.
                    </div>
                )}
            </div>
        </div>
    );
};
