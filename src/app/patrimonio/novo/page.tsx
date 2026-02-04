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
      await api.post("/patrimonio/ativos", {
        ...form,
        codigo: form.numeroPatrimonio, // Map for backend
      });
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
              <Select
                name="categoria"
                label="Categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                options={[
                  { value: "ELECTROMEDICINA", label: "Electromedicina" },
                  { value: "MOBILIARIO_HOSPITALAR", label: "Mobiliário Hospitalar" },
                  { value: "INFORMATICA", label: "Informática" },
                  { value: "VEICULOS", label: "Veículos" },
                  { value: "INFRAESTRUTURA", label: "Infraestrutura" },
                  { value: "GASES_MEDICINAIS", label: "Gases Medicinais" },
                  { value: "INSTRUMENTOS_CIRURGICOS", label: "Inst. Cirúrgicos" },
                  { value: "LABORATORIO", label: "Laboratório" },
                  { value: "IMAGEM_DIAGNOSTICO", label: "Imagem/Diagnóstico" },
                  { value: "OUTROS", label: "Outros" }
                ]}
              />
              <Select
                name="status"
                label="Status"
                value={form.status}
                onChange={handleChange}
                required
                options={[
                  { value: "OPERACIONAL", label: "Operacional" },
                  { value: "EM_MANUTENCAO", label: "Em Manutenção" },
                  { value: "AGUARDANDO_PECAS", label: "Aguardando Peças" },
                  { value: "INOPERANTE", label: "Inoperante" },
                  { value: "EM_CALIBRACAO", label: "Em Calibração" },
                  { value: "DESATIVADO", label: "Desativado" },
                  { value: "ABATIDO", label: "Abatido" }
                ]}
              />
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
