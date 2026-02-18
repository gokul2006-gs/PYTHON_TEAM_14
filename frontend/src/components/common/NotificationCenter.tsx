import React, { useEffect, useState } from 'react';
import { notificationService, type Notification } from '../../services/notificationService';
import { X } from 'lucide-react';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (isOpen) {
            notificationService.getAll().then(setNotifications);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-16 z-50 mr-4 w-80 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100">
                    <X size={16} className="text-slate-500" />
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`border-b border-slate-50 p-4 hover:bg-slate-50 ${notif.is_read ? 'opacity-70' : ''}`}>
                            <div className="flex gap-3">
                                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900 leading-relaxed">{notif.message}</p>
                                    <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(notif.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-sm text-slate-500">
                        No notifications
                    </div>
                )}
            </div>
        </div>
    );
};
