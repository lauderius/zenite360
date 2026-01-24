"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoAtivoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    numeroPatrimonio: "",
    nome: "",
    categoria: "ELECTROMEDICINA",
    status: "OPERACIONAL",
    valor: 0,
    localizacao: "",
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
      await api.post("/patrimonio/ativos", form);
      setSuccess(true);
      setTimeout(() => router.push("/patrimonio"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar ativo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Ativo" description="Cadastrar novo ativo patrimonial" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="numeroPatrimonio" label="Nº Patrimônio" value={form.numeroPatrimonio} onChange={handleChange} required />
              <Input name="nome" label="Nome" value={form.nome} onChange={handleChange} required />
              <Select name="categoria" label="Categoria" value={form.categoria} onChange={handleChange} required>
                <option value="ELECTROMEDICINA">Electromedicina</option>
                <option value="MOBILIARIO_HOSPITALAR">Mobiliário Hospitalar</option>
                <option value="INFORMATICA">Informática</option>
                <option value="VEICULOS">Veículos</option>
                <option value="INFRAESTRUTURA">Infraestrutura</option>
                <option value="GASES_MEDICINAIS">Gases Medicinais</option>
                <option value="INSTRUMENTOS_CIRURGICOS">Inst. Cirúrgicos</option>
                <option value="LABORATORIO">Laboratório</option>
                <option value="IMAGEM_DIAGNOSTICO">Imagem/Diagnóstico</option>
                <option value="OUTROS">Outros</option>
              </Select>
              <Select name="status" label="Status" value={form.status} onChange={handleChange} required>
                <option value="OPERACIONAL">Operacional</option>
                <option value="EM_MANUTENCAO">Em Manutenção</option>
                <option value="AGUARDANDO_PECAS">Aguardando Peças</option>
                <option value="INOPERANTE">Inoperante</option>
                <option value="EM_CALIBRACAO">Em Calibração</option>
                <option value="DESATIVADO">Desativado</option>
                <option value="ABATIDO">Abatido</option>
              </Select>
              <Input name="valor" label="Valor (Kz)" type="number" value={form.valor} onChange={handleChange} required />
              <Input name="localizacao" label="Localização" value={form.localizacao} onChange={handleChange} required />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Ativo cadastrado com sucesso!</div>}
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
