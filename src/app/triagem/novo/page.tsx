"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner } from "@/components/ui";
import { api } from "@/services/api";
import { Search, AlertCircle } from "lucide-react";

export default function NovaTriagemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente_id: "",
    paciente_nome: "",
    idade: "",
    genero: "Masculino",
    prioridade: "URGENTE",
    status: "Aguardando",
    queixa_principal: "",
    pressao_arterial: "",
    frequencia_cardiaca: "",
    frequencia_respiratoria: "",
    temperatura: "",
    saturacao_oxigenio: "",
  });
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch patients for autocomplete
  useEffect(() => {
    const fetchPacientes = async () => {
      if (searchTerm.length < 2) {
        setPacientes([]);
        return;
      }
      try {
        const res = await api.get<{ data: any[] }>(`/pacientes?q=${searchTerm}`);
        setPacientes(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPacientes();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectPaciente = (paciente: any) => {
    const birthDate = new Date(paciente.data_nascimento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    setForm({
      ...form,
      paciente_id: paciente.id,
      paciente_nome: paciente.nome_completo,
      idade: age.toString(),
      genero: paciente.genero === "Masculino" ? "Masculino" : "Feminino",
    });
    setSearchTerm(paciente.nome_completo);
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/triagem", form);
      setSuccess(true);
      setTimeout(() => router.push("/triagem"), 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar triagem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Nova Triagem" description="Cadastrar novo paciente na triagem" />
      <PageContent>
        <Card className="max-w-4xl mx-auto glass-card border-none rounded-3xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-2xl font-black">Dados da Triagem</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Search */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Pesquisar Paciente
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="Digite o nome ou BI do paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                  />
                  {showDropdown && pacientes.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                      {pacientes.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectPaciente(p)}
                          className="w-full text-left px-4 py-3 hover:bg-brand-500/10 transition-colors border-b border-slate-200 dark:border-slate-800 last:border-0"
                        >
                          <p className="font-bold text-slate-900 dark:text-white">{p.nome_completo}</p>
                          <p className="text-xs text-slate-500 font-mono">{p.bi_numero} • {p.numero_processo}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="paciente_nome"
                  label="Nome do Paciente"
                  value={form.paciente_nome}
                  onChange={handleChange}
                  required
                  disabled
                  className="bg-slate-100 dark:bg-slate-800"
                />
                <Input name="idade" label="Idade" type="number" value={form.idade} onChange={handleChange} required />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Gênero
                  </label>
                  <select
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
                  >
                    <option value="Masculino" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Masculino</option>
                    <option value="Feminino" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Prioridade (Protocolo de Manchester)
                  </label>
                  <select
                    name="prioridade"
                    value={form.prioridade}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
                  >
                    <option value="EMERGENCIA" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold">🔴 Emergência (Vermelho)</option>
                    <option value="MUITO_URGENTE" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-bold">🟠 Muito Urgente (Laranja)</option>
                    <option value="URGENTE" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold">🟡 Urgente (Amarelo)</option>
                    <option value="POUCO_URGENTE" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold">🟢 Pouco Urgente (Verde)</option>
                    <option value="NAO_URGENTE" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold">🔵 Não Urgente (Azul)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full h-14 px-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
                  >
                    <option value="Aguardando" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Aguardando</option>
                    <option value="Em Atendimento" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Em Atendimento</option>
                    <option value="Finalizado" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Finalizado</option>
                  </select>
                </div>
              </div>

              {/* Vital Signs from Nursing */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Sinais Vitais (Enfermagem)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    name="pressao_arterial"
                    label="Pressão Arterial"
                    placeholder="120/80"
                    value={form.pressao_arterial}
                    onChange={handleChange}
                  />
                  <Input
                    name="frequencia_cardiaca"
                    label="FC (bpm)"
                    type="number"
                    placeholder="72"
                    value={form.frequencia_cardiaca}
                    onChange={handleChange}
                  />
                  <Input
                    name="frequencia_respiratoria"
                    label="FR (rpm)"
                    type="number"
                    placeholder="18"
                    value={form.frequencia_respiratoria}
                    onChange={handleChange}
                  />
                  <Input
                    name="temperatura"
                    label="Temperatura (°C)"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={form.temperatura}
                    onChange={handleChange}
                  />
                  <Input
                    name="saturacao_oxigenio"
                    label="SpO2 (%)"
                    type="number"
                    placeholder="98"
                    value={form.saturacao_oxigenio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Queixa Principal
                </label>
                <textarea
                  name="queixa_principal"
                  value={form.queixa_principal}
                  onChange={handleChange}
                  className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Descreva a queixa principal do paciente..."
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-4 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-4 rounded-2xl text-green-600 dark:text-green-400 text-sm font-bold">
                  ✓ Triagem cadastrada com sucesso! Redirecionando...
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/triagem")}
                  className="px-6"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.paciente_id}
                  className="gradient-brand border-none px-8"
                  isLoading={isLoading}
                >
                  {isLoading ? "Salvando..." : "Cadastrar Triagem"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}
