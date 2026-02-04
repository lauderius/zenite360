'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Printer,
    Download,
    Stethoscope,
    Activity,
    Microscope,
    History as HistoryIcon,
    AlertTriangle,
    Info,
    Calendar,
    MapPin,
    Phone,
    Droplet,
    IdCard,
    PlusCircle,
    ChevronDown,
    ChevronRight,
    Eye,
    FileText,
    User,
    ShieldAlert
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Avatar } from '@/components/ui';
import Link from 'next/link';
import { api } from '@/services/api';

export default function PacienteDetalhesPage({ params }: { params: { id: string } }) {
    const [paciente, setPaciente] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPaciente = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<any>(`/pacientes/${params.id}`);
            setPaciente(data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do paciente:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaciente();
    }, [params.id]);

    if (isLoading || !paciente) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
                </div>
            </MainLayout>
        );
    }

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-full">
                {/* Profile Banner */}
                <div className="glass-panel border-none rounded-b-[40px] p-8 pb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <Link href="/pacientes" className="absolute -top-4 -left-4 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        <div className="w-40 h-40 rounded-3xl bg-slate-900 border-2 border-brand-500/20 shadow-2xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            <div className="w-full h-full flex items-center justify-center font-black text-4xl text-brand-500">
                                {paciente.nome_completo.charAt(0)}
                            </div>
                            <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                <h1 className="text-4xl font-black text-white tracking-tight">{paciente.nome_completo}</h1>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">Paciente Estável</Badge>
                                <Badge className="gradient-brand border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px] shadow-lg shadow-brand-500/20">Processo: {paciente.numero_processo}</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoItem icon={<IdCard className="w-4 h-4 text-brand-500" />} label="B.I." value={paciente.bi_numero} />
                                <InfoItem icon={<Calendar className="w-4 h-4 text-brand-500" />} label="Idade" value={`${calculateAge(paciente.data_nascimento)} anos (${paciente.genero})`} />
                                <InfoItem icon={<Droplet className="w-4 h-4 text-red-500" />} label="Sangue" value={paciente.grupo_sanguineo || 'N/R'} />
                                <InfoItem icon={<MapPin className="w-4 h-4 text-brand-500" />} label="Localização" value={`${paciente.municipio || 'N/A'}, ${paciente.provincia}`} />
                                <InfoItem icon={<Phone className="w-4 h-4 text-brand-500" />} label="Contacto" value={paciente.telefone_principal} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button className="gradient-brand border-none rounded-2xl font-bold px-8 h-12 flex gap-2 group shadow-xl shadow-brand-500/20">
                                <PlusCircle className="w-5 h-5" />
                                Nova Evolução
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => window.open(`/api/pdf/paciente/${params.id}`, '_blank')}
                                    variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-white/5 hover:bg-white/5">
                                    <Printer className="w-5 h-5" />
                                </Button>
                                <Button
                                    onClick={() => window.open(`/api/pdf/paciente/${params.id}`, '_blank')}
                                    variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-white/5 hover:bg-white/5">
                                    <Download className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="max-w-7xl mx-auto w-full p-8 lg:p-12 -mt-8 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar: Navigation & Sub-stats */}
                        <div className="lg:col-span-3 space-y-6">
                            <Card className="glass-card border-none rounded-3xl p-4">
                                <nav className="flex flex-col gap-1">
                                    <NavButton icon={<Activity className="w-4 h-4" />} label="Sumário Clínico" />
                                    <NavButton icon={<HistoryIcon className="w-4 h-4" />} label="Linha do Tempo" active />
                                    <NavButton icon={<Microscope className="w-4 h-4" />} label="Exames e Lab" />
                                    <NavButton icon={<Stethoscope className="w-4 h-4" />} label="Prescrições" />
                                </nav>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <StatMini label="Consultas" value={paciente.consultas?.length.toString()} color="text-brand-400" />
                                <StatMini label="Agendamentos" value={paciente.agendamentos?.length.toString()} color="text-indigo-400" />
                                <StatMini label="Exames" value={paciente.exames_solicitados?.length.toString()} color="text-amber-500" />
                                <StatMini label="Internam." value="0" color="text-orange-500" />
                            </div>

                            <Card className="glass-card border-none rounded-3xl p-6 bg-red-500/5 border border-red-500/10">
                                <h4 className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-[10px] mb-4">
                                    <ShieldAlert className="w-4 h-4" /> Alergias e Avisos
                                </h4>
                                <div className="space-y-3">
                                    <div className={`text-xs font-bold leading-relaxed p-3 rounded-xl border ${paciente.alergias ? 'text-red-200 bg-red-500/20 border-red-500/30' : 'text-slate-500 bg-white/5 border-white/10'}`}>
                                        {paciente.alergias || 'Nenhuma alergia registada até ao momento.'}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Timeline Content */}
                        <div className="lg:col-span-9">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white tracking-tight">Timeline Longitudinal</h3>
                                <div className="flex gap-2">
                                    <select className="bg-white/5 border border-white/5 text-xs font-bold text-slate-400 rounded-xl px-4 py-2 outline-none uppercase tracking-widest">
                                        <option>Recentes</option>
                                        <option>Ano 2024</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative pl-8 border-l-2 border-white/5 space-y-12 pb-12">
                                {paciente.consultas?.map((c: any) => (
                                    <TimelineEvent
                                        key={c.id}
                                        type="consultation"
                                        title={`Consulta: ${c.numero_consulta}`}
                                        sector={c.tipo_consulta?.replace('_', ' ') || 'Consulta Geral'}
                                        date={`${new Date(c.created_at).toLocaleDateString()} — ${new Date(c.created_at).toLocaleTimeString().substring(0, 5)}`}
                                        doctor={c.utilizadores_consultas_medico_idToutilizadores?.name || `Médico ID: ${c.medico_id}`}
                                        urgency={c.status}
                                        urgencyColor={c.status === 'Concluido' ? 'text-emerald-400' : 'text-brand-400'}
                                        note={c.conduta_medica || c.observacoes_gerais || "Sem observações detalhadas registradas para esta consulta."}
                                    />
                                ))}

                                {paciente.consultas?.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sem eventos clínicos registados</p>
                                    </div>
                                )}

                                {/* Load More placeholder */}
                                {paciente.consultas?.length > 0 && (
                                    <div className="flex justify-center pt-8">
                                        <Button variant="ghost" className="text-slate-600 hover:text-white flex items-center gap-2 group uppercase font-black text-[10px] tracking-widest">
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                            Carregar mais eventos
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-black text-slate-200">{value}</p>
            </div>
        </div>
    );
}

function NavButton({ icon, label, active }: any) {
    return (
        <button className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${active
            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
            : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}>
            {icon}
            {label}
        </button>
    );
}

function StatMini({ label, value, color }: any) {
    return (
        <div className="glass-card border-none rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value || 0}</p>
        </div>
    );
}

function TimelineEvent({ type, title, sector, date, doctor, urgency, urgencyColor, note, critical }: any) {
    const iconMap: any = {
        surgery: <Activity className="w-5 h-5 text-red-500" />,
        consultation: <Stethoscope className="w-5 h-5 text-brand-400" />,
        exam: <Microscope className="w-5 h-5 text-amber-500" />
    };

    return (
        <div className="relative">
            <div className={`absolute -left-[49px] top-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-white/10 shadow-2xl z-10 hover:scale-110 transition-transform`}>
                {iconMap[type]}
            </div>

            <Card className="glass-card border-none rounded-3xl p-6 hover:translate-x-1 transition-transform">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${urgencyColor || 'text-slate-500'}`}>{sector}</p>
                        <h4 className="text-xl font-black text-white tracking-tight">{title}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-white">{date.split('—')[0]}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase">{date.split('—')[1]}</p>
                    </div>
                </div>

                {critical && (
                    <div className="mb-6 flex items-center gap-4 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{critical.label}</p>
                            <p className="text-sm font-bold text-red-200/80">{critical.detail}</p>
                        </div>
                    </div>
                )}

                {doctor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <User className="w-4 h-4 text-brand-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Responsável</p>
                                <p className="text-sm font-bold text-slate-200">{doctor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-brand-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Status / Triagem</p>
                                <p className={`text-sm font-black ${urgencyColor}`}>{urgency}</p>
                            </div>
                        </div>
                    </div>
                )}

                {note && (
                    <div className="bg-slate-900 shadow-inner rounded-2xl p-4 border-l-4 border-white/5 relative mb-6">
                        <p className="text-sm italic font-medium text-slate-400 leading-relaxed">
                            "{note}"
                        </p>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-brand-500/10 hover:text-brand-500">
                        <FileText className="w-3.5 h-3.5 mr-2" /> Detalhes do Evento
                    </Button>
                </div>
            </Card>
        </div>
    );
}
