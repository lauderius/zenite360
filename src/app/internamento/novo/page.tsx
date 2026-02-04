"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoInternamentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente: "",
    leito: "",
    setor: "",
    medicoResponsavel: "",
    dataAdmissao: "",
    diagnostico: "",
    status: "EM_TRATAMENTO",
    diasInternado: 1,
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
      await api.post("/internamento", form);
      setSuccess(true);
      setTimeout(() => router.push("/internamento"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar internamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Internamento" description="Cadastrar novo internamento" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Internamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="paciente" label="Paciente" value={form.paciente} onChange={handleChange} required />
              <Input name="leito" label="Leito" value={form.leito} onChange={handleChange} required />
              <Input name="setor" label="Setor" value={form.setor} onChange={handleChange} required />
              <Input name="medicoResponsavel" label="Médico Responsável" value={form.medicoResponsavel} onChange={handleChange} required />
              <Input name="dataAdmissao" label="Data de Admissão" type="date" value={form.dataAdmissao} onChange={handleChange} required />
              <Input name="diagnostico" label="Diagnóstico" value={form.diagnostico} onChange={handleChange} required />
              <Select
                name="status"
                label="Status"
                value={form.status}
                onChange={handleChange}
                required
                options={[
                  { value: "EM_TRATAMENTO", label: "Em Tratamento" },
                  { value: "ALTA_MEDICA", label: "Alta Médica" },
                  { value: "TRANSFERIDO", label: "Transferido" },
                  { value: "OBITO", label: "Óbito" }
                ]}
              />
              <Input name="diasInternado" label="Dias Internado" type="number" value={form.diasInternado} onChange={handleChange} required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Internamento cadastrado com sucesso!</div>}
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
