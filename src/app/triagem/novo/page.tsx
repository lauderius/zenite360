"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovaTriagemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente: "",
    idade: "",
    genero: "M",
    horaChegada: "",
    prioridade: "EMERGENCIA",
    status: "AGUARDANDO_TRIAGEM",
    queixaPrincipal: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setTimeout(() => router.push("/triagem"), 1000);
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
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados da Triagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="paciente" label="Paciente" value={form.paciente} onChange={handleChange} required />
              <Input name="idade" label="Idade" type="number" value={form.idade} onChange={handleChange} required />
              <Select name="genero" label="Gênero" value={form.genero} onChange={handleChange} required>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </Select>
              <Input name="horaChegada" label="Hora de Chegada" type="time" value={form.horaChegada} onChange={handleChange} required />
              <Select name="prioridade" label="Prioridade" value={form.prioridade} onChange={handleChange} required>
                <option value="EMERGENCIA">Emergência</option>
                <option value="MUITO_URGENTE">Muito Urgente</option>
                <option value="URGENTE">Urgente</option>
                <option value="POUCO_URGENTE">Pouco Urgente</option>
                <option value="NAO_URGENTE">Não Urgente</option>
              </Select>
              <Input name="queixaPrincipal" label="Queixa Principal" value={form.queixaPrincipal} onChange={handleChange} />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Triagem cadastrada com sucesso!</div>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}
