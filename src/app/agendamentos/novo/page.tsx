"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoAgendamentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente: "",
    tipoAtendimento: "CONSULTA_EXTERNA",
    dataAgendamento: "",
    horaInicio: "",
    horaFim: "",
    medico: "",
    departamento: "",
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
      await api.post("/agendamentos", form);
      setSuccess(true);
      setTimeout(() => router.push("/agendamentos"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Agendamento" description="Cadastrar novo agendamento" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="paciente" label="Paciente" value={form.paciente} onChange={handleChange} required />
              <Select name="tipoAtendimento" label="Tipo de Atendimento" value={form.tipoAtendimento} onChange={handleChange} required>
                <option value="CONSULTA_EXTERNA">Consulta Externa</option>
                <option value="RETORNO">Retorno</option>
                <option value="EXAME">Exame</option>
                <option value="CIRURGIA">Cirurgia</option>
                <option value="DOMICILIARIO">Domiciliário</option>
              </Select>
              <Input name="dataAgendamento" label="Data" type="date" value={form.dataAgendamento} onChange={handleChange} required />
              <Input name="horaInicio" label="Hora Início" type="time" value={form.horaInicio} onChange={handleChange} required />
              <Input name="horaFim" label="Hora Fim" type="time" value={form.horaFim} onChange={handleChange} required />
              <Input name="medico" label="Médico" value={form.medico} onChange={handleChange} required />
              <Input name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Agendamento cadastrado com sucesso!</div>}
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
