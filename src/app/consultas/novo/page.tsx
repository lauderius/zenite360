"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovaConsultaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente: "",
    medico: "",
    departamento: "",
    dataHoraInicio: "",
    tipoAtendimento: "Consulta Externa",
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
      await api.post("/consultas", form);
      setSuccess(true);
      setTimeout(() => router.push("/consultas"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar consulta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Nova Consulta" description="Cadastrar nova consulta médica" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados da Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="paciente" label="Paciente" value={form.paciente} onChange={handleChange} required />
              <Input name="medico" label="Médico" value={form.medico} onChange={handleChange} required />
              <Input name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} required />
              <Input name="dataHoraInicio" label="Data e Hora" type="datetime-local" value={form.dataHoraInicio} onChange={handleChange} required />
              <Select name="tipoAtendimento" label="Tipo de Atendimento" value={form.tipoAtendimento} onChange={handleChange} required>
                <option value="Consulta Externa">Consulta Externa</option>
                <option value="Retorno">Retorno</option>
                <option value="Exame">Exame</option>
                <option value="Cirurgia">Cirurgia</option>
                <option value="Domiciliário">Domiciliário</option>
              </Select>
              <Input name="queixaPrincipal" label="Queixa Principal" value={form.queixaPrincipal} onChange={handleChange} />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Consulta cadastrada com sucesso!</div>}
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
