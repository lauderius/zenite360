"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoMedicamentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    apresentacao: "",
    tipo: "Comprimido",
    estoque: 0,
    estoqueMinimo: 0,
    preco: 0,
    validade: "",
    controlado: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/farmacia/medicamentos", form);
      setSuccess(true);
      setTimeout(() => router.push("/farmacia"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar medicamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Medicamento" description="Cadastrar novo medicamento no estoque" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Medicamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="nome" label="Nome" value={form.nome} onChange={handleChange} required />
              <Input name="apresentacao" label="Apresentação" value={form.apresentacao} onChange={handleChange} required />
              <Select name="tipo" label="Tipo" value={form.tipo} onChange={handleChange} required>
                <option value="Comprimido">Comprimido</option>
                <option value="Cápsula">Cápsula</option>
                <option value="Solução">Solução</option>
                <option value="Injetável">Injetável</option>
                <option value="Pomada">Pomada</option>
                <option value="Outro">Outro</option>
              </Select>
              <Input name="estoque" label="Estoque" type="number" value={form.estoque} onChange={handleChange} required />
              <Input name="estoqueMinimo" label="Estoque Mínimo" type="number" value={form.estoqueMinimo} onChange={handleChange} required />
              <Input name="preco" label="Preço (Kz)" type="number" value={form.preco} onChange={handleChange} required />
              <Input name="validade" label="Validade" type="date" value={form.validade} onChange={handleChange} required />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="controlado" checked={form.controlado} onChange={handleChange} />
                Controlado
              </label>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Medicamento cadastrado com sucesso!</div>}
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
