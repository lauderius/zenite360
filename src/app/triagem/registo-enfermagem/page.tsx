'use client';

import React, { useState } from 'react';
import {
    Activity,
    Heart,
    Thermometer,
    Wind,
    Droplet,
    ClipboardCheck,
    History,
    User as UserIcon,
    Save,
    X,
    Printer,
    AlertTriangle,
    ChevronRight,
    Stethoscope,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';

export default function RegistoEnfermagemPage() {
    const [vitals, setVitals] = useState({
        ta: '',
        fc: '',
        fr: '',
        temp: '',
        spo2: '',
        glicemia: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVitals(prev => ({ ...prev, [name]: value }));
    };

    return (
        <MainLayout>
            <PageHeader
                title="Registo de Enfermagem"
                description="Monitorização de sinais vitais e evolução clínica do paciente."
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <History className="w-4 h-4" />
                            Ver Histórico
                        </Button>
                        <Button variant="default" size="sm" className="gradient-brand border-none">
                            <Stethoscope className="w-4 h-4" />
                            Processo Clínico
                        </Button>
                    </div>
                }
            />

            <PageContent>
                {/* Patient Profile Banner */}
                <div className="glass-panel rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 border-brand-500/10">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <UserIcon className="w-12 h-12 text-slate-700 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h2 className="text-2xl font-black text-white tracking-tight">João Manuel da Silva</h2>
                            <Badge variant="emergencia" className="bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest px-3">Alto Risco</Badge>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5"><Badge variant="outline" className="text-xs">B.I.</Badge> 000123456LA042</span>
                            <span className="flex items-center gap-1.5"><Badge variant="outline" className="text-xs">CAMA</Badge> <span className="text-brand-400 font-bold">104-A</span></span>
                            <span className="flex items-center gap-1.5"><Badge variant="outline" className="text-xs">IDADE</Badge> 45 Anos</span>
                        </div>
                        <p className="text-red-400 text-xs font-bold mt-3 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            ALERGIAS: Penicilina, Dipirona
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Vitals Entry */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="glass-card rounded-3xl border-none overflow-hidden">
                            <CardHeader className="bg-white/5 border-b border-white/5">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Activity className="w-5 h-5 text-brand-500" />
                                    Sinais Vitais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <VitalInput label="TA (mmHg)" name="ta" placeholder="120/80" icon={<Heart className="w-4 h-4" />} />
                                    <VitalInput label="FC (bpm)" name="fc" placeholder="72" icon={<Activity className="w-4 h-4" />} />
                                    <VitalInput label="FR (rpm)" name="fr" placeholder="18" icon={<Wind className="w-4 h-4" />} />
                                    <VitalInput label="Temp (°C)" name="temp" placeholder="36.5" icon={<Thermometer className="w-4 h-4" />} />
                                    <VitalInput label="SpO2 (%)" name="spo2" placeholder="98" icon={<Droplet className="w-4 h-4" />} />
                                    <VitalInput label="Glicémia (mg/dL)" name="glicemia" placeholder="110" icon={<Activity className="w-4 h-4" />} />
                                </div>

                                <div className="mt-8 grid grid-cols-3 gap-3">
                                    <LastReading label="Última TA" value="118/75" time="há 4h" />
                                    <LastReading label="Última FC" value="70 bpm" time="há 4h" />
                                    <LastReading label="Última Tª" value="37.1 °C" time="há 4h" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Nursing Notes */}
                    <div className="lg:col-span-7 flex flex-col h-full">
                        <Card className="glass-card rounded-3xl border-none flex-1 flex flex-col overflow-hidden">
                            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <ClipboardCheck className="w-5 h-5 text-brand-500" />
                                    Notas de Enfermagem
                                </CardTitle>
                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 14:30</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span>24/05/2024</span>
                                </div>
                            </CardHeader>

                            <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex flex-wrap gap-2">
                                <p className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Quick Tags</p>
                                {['Estável', 'Agitado', 'Colaborante', 'Lúcido', 'Afebril', 'Dispneico'].map(tag => (
                                    <button key={tag} className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-400 hover:bg-brand-500/20 transition-all">
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col gap-6">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Evolução e Intervenções</label>
                                    <textarea
                                        className="w-full flex-1 min-h-[250px] input-premium resize-none leading-relaxed text-slate-200 placeholder:text-slate-600"
                                        placeholder="Descreva o estado do paciente, intercorrências e intervenções realizadas..."
                                    />
                                </div>

                                <div className="flex flex-wrap gap-6 py-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer hidden" />
                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-700 bg-slate-900 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors tracking-tight">Medicação concluída</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="peer hidden" />
                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-700 bg-slate-900 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors tracking-tight">Higiene realizada</span>
                                    </label>
                                </div>
                            </CardContent>

                            <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <Button variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl">
                                    <Printer className="w-4 h-4" />
                                    Imprimir Guia
                                </Button>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="rounded-2xl border-white/10 text-slate-400 hover:text-white">Cancelar</Button>
                                    <Button className="gradient-brand border-none rounded-2xl font-bold px-8 flex gap-2 group">
                                        <Save className="w-4 h-4" />
                                        Validar e Gravar
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </PageContent>
        </MainLayout>
    );
}

function VitalInput({ label, name, placeholder, icon }: { label: string, name: string, placeholder: string, icon: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500/50">
                    {icon}
                </div>
                <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    className="input-premium pl-12 h-14 text-lg font-black text-white"
                />
            </div>
        </div>
    );
}

function LastReading({ label, value, time }: { label: string, value: string, time: string }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-white">{value}</p>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{time}</p>
        </div>
    );
}
