'use client';

import React, { useState, useEffect } from 'react';
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
    CheckCircle2,
    Search
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Spinner } from '@/components/ui';
import { api } from '@/services/api';

interface Paciente {
    id: number;
    nome_completo: string;
    bi_numero: string;
    data_nascimento: string;
    genero: string;
    status_triagem?: string;
}

export default function RegistoEnfermagemPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [vitals, setVitals] = useState({
        ta: '',
        fc: '',
        fr: '',
        temp: '',
        spo2: '',
        glicemia: ''
    });

    useEffect(() => {
        async function fetchPacientes() {
            try {
                // Fetching patients who are in triage or recently triaged
                const response = await api.get<{ data: Paciente[] }>('/pacientes');
                setPacientes(response.data || []);
            } catch (error) {
                console.error('Erro ao buscar pacientes:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPacientes();
    }, []);

    const handlePatientSelect = (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        // Reset vitals for new selection or fetch last ones
        setVitals({
            ta: '',
            fc: '',
            fr: '',
            temp: '',
            spo2: '',
            glicemia: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVitals(prev => ({ ...prev, [name]: value }));
    };

    const filteredPacientes = pacientes.filter(p =>
        p.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bi_numero.includes(searchTerm)
    );

    return (
        <MainLayout>
            <PageHeader
                title="Registo de Enfermagem"
                description="Gestão de pacientes e monitorização de sinais vitais."
            />

            <PageContent>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">

                    {/* Left Column: Patient List */}
                    <Card className="lg:col-span-4 flex flex-col overflow-hidden">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-lg">Pacientes</CardTitle>
                                <Badge variant="outline">{filteredPacientes.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Nome ou BI..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0">
                            {isLoading ? (
                                <div className="flex justify-center p-8"><Spinner /></div>
                            ) : (
                                <div className="divide-y">
                                    {filteredPacientes.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handlePatientSelect(p)}
                                            className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between ${selectedPaciente?.id === p.id ? 'bg-sky-50 border-r-4 border-sky-500' : ''}`}
                                        >
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-sky-600 truncate max-w-[200px]">{p.nome_completo}</p>
                                                <p className="text-xs text-slate-500 font-mono">{p.bi_numero}</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 text-slate-300 ${selectedPaciente?.id === p.id ? 'text-sky-500' : ''}`} />
                                        </button>
                                    ))}
                                    {filteredPacientes.length === 0 && (
                                        <div className="p-8 text-center text-slate-400 text-sm">Nenhum paciente encontrado.</div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column: Clinical Details */}
                    <div className="lg:col-span-8 overflow-y-auto pr-2">
                        {selectedPaciente ? (
                            <div className="space-y-6">
                                {/* Selected Patient Banner */}
                                <div className="bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/10 shadow-xl">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
                                        <UserIcon className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                            <h2 className="text-2xl font-bold text-white tracking-tight">{selectedPaciente.nome_completo}</h2>
                                            <Badge className="bg-sky-500/20 text-sky-400 border border-sky-500/30">Em Observação</Badge>
                                        </div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                                            <span>BI: {selectedPaciente.bi_numero}</span>
                                            <span>Nascimento: {new Date(selectedPaciente.data_nascimento).toLocaleDateString()}</span>
                                            <span>Gênero: {selectedPaciente.genero === 'M' ? 'Masculino' : 'Feminino'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white">
                                            <History className="w-4 h-4 mr-2" /> Histórico
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sinais Vitais */}
                                    <Card className="rounded-3xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-sky-500" />
                                                Sinais Vitais
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <VitalInput label="TA (mmHg)" name="ta" value={vitals.ta} onChange={handleInputChange} placeholder="120/80" />
                                                <VitalInput label="FC (bpm)" name="fc" value={vitals.fc} onChange={handleInputChange} placeholder="72" />
                                                <VitalInput label="FR (rpm)" name="fr" value={vitals.fr} onChange={handleInputChange} placeholder="18" />
                                                <VitalInput label="Temp (°C)" name="temp" value={vitals.temp} onChange={handleInputChange} placeholder="36.5" />
                                                <VitalInput label="SpO2 (%)" name="spo2" value={vitals.spo2} onChange={handleInputChange} placeholder="98" />
                                                <VitalInput label="Glicémia" name="glicemia" value={vitals.glicemia} onChange={handleInputChange} placeholder="110" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Notas de Enfermagem */}
                                    <Card className="rounded-3xl flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ClipboardCheck className="w-5 h-5 text-sky-500" />
                                                Notas Clinicas
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col gap-4">
                                            <textarea
                                                className="w-full flex-1 min-h-[150px] p-4 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                                                placeholder="Descreva a evolução do paciente..."
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                                                    <Save className="w-4 h-4 mr-2" /> Gravar Registo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                <Stethoscope className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Selecione um paciente para iniciar o registo</p>
                                <p className="text-sm">Use a barra de pesquisa à esquerda para encontrar o paciente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </PageContent>
        </MainLayout>
    );
}

function VitalInput({ label, name, value, onChange, placeholder }: { label: string, name: string, value: string, onChange: any, placeholder: string }) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <Input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-10 text-sm font-bold"
            />
        </div>
    );
}
