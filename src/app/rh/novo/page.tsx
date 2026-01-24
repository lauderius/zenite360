"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    numeroMecanografico: "",
    nomeCompleto: "",
    cargo: "",
    departamento: "",
    especialidade: "",
    nivelAcesso: "FUNCIONARIO",
    status: "ACTIVO",
    dataAdmissao: "",
    telefone: "",
    email: "",
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
      await api.post("/rh/funcionarios", form);
      setSuccess(true);
      setTimeout(() => router.push("/rh"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar funcionário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Funcionário" description="Cadastrar novo funcionário" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="numeroMecanografico" label="Nº Mecanográfico" value={form.numeroMecanografico} onChange={handleChange} required />
              <Input name="nomeCompleto" label="Nome Completo" value={form.nomeCompleto} onChange={handleChange} required />
              <Input name="cargo" label="Cargo" value={form.cargo} onChange={handleChange} required />
              <Input name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} required />
              <Input name="especialidade" label="Especialidade" value={form.especialidade} onChange={handleChange} />
              <Select name="nivelAcesso" label="Nível de Acesso" value={form.nivelAcesso} onChange={handleChange} required>
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="MEDICO">Médico</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="ENFERMEIRO">Enfermeiro</option>
                <option value="FARMACEUTICO">Farmacêutico</option>
                <option value="OUTRO">Outro</option>
              </Select>
              <Select name="status" label="Status" value={form.status} onChange={handleChange} required>
                <option value="ACTIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUSPENSO">Suspenso</option>
                <option value="FERIAS">Férias</option>
                <option value="AFASTADO">Afastado</option>
              </Select>
              <Input name="dataAdmissao" label="Data de Admissão" type="date" value={form.dataAdmissao} onChange={handleChange} required />
              <Input name="telefone" label="Telefone" value={form.telefone} onChange={handleChange} required />
              <Input name="email" label="Email" type="email" value={form.email} onChange={handleChange} required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Funcionário cadastrado com sucesso!</div>}
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
