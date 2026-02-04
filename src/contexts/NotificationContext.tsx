'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
    time: string;
    unread: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'time' | 'unread'>) => {
        const newNotif: Notification = {
            ...n,
            id: Math.random().toString(36).substr(2, 9),
            time: 'Agora',
            unread: true
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    }, []);

    // Background automated checks
    useEffect(() => {
        const checkAlerts = async () => {
            try {
                // Check Stock
                const stockRes = await api.get<{ data: any[] }>('/stock');
                const lowStock = stockRes.data?.filter(i => i.quantidade_atual <= i.quantidade_minima);
                if (lowStock && lowStock.length > 0) {
                    addNotification({
                        title: 'Stock Baixo',
                        description: `${lowStock.length} itens atingiram o nível crítico de stock.`,
                        type: 'WARNING',
                        link: '/farmacia'
                    });
                }

                // Check Patrimonio
                const patRes = await api.get<any>('/patrimonio/dashboard');
                if (patRes.manutencoesCriticas > 0) {
                    addNotification({
                        title: 'Manutenção Crítica',
                        description: `Existem ${patRes.manutencoesCriticas} ordens de manutenção críticas pendentes.`,
                        type: 'CRITICAL',
                        link: '/patrimonio'
                    });
                }
            } catch (error) {
                console.error('Erro ao verificar alertas:', error);
            }
        };

        checkAlerts();
        const interval = setInterval(checkAlerts, 300000); // Check every 5 mins
        return () => clearInterval(interval);
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
