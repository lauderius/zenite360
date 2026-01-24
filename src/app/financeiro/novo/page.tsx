"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovaFaturaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    paciente: "",
    tipo: "Consulta",
    dataEmissao: "",
    dataVencimento: "",
    total: 0,
    valorPago: 0,
    status: "EMITIDA",
    formaPagamento: "DINHEIRO",
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
      await api.post("/financeiro/faturas", form);
      setSuccess(true);
      setTimeout(() => router.push("/financeiro"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar fatura");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Nova Fatura" description="Emitir nova fatura para paciente" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados da Fatura</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="paciente" label="Paciente" value={form.paciente} onChange={handleChange} required />
              <Select name="tipo" label="Tipo" value={form.tipo} onChange={handleChange} required>
                <option value="Consulta">Consulta</option>
                <option value="Exames">Exames</option>
                <option value="Internamento">Internamento</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Outro">Outro</option>
              </Select>
              <Input name="dataEmissao" label="Data de Emissão" type="date" value={form.dataEmissao} onChange={handleChange} required />
              <Input name="dataVencimento" label="Data de Vencimento" type="date" value={form.dataVencimento} onChange={handleChange} required />
              <Input name="total" label="Total (Kz)" type="number" value={form.total} onChange={handleChange} required />
              <Input name="valorPago" label="Valor Pago (Kz)" type="number" value={form.valorPago} onChange={handleChange} required />
              <Select name="status" label="Status" value={form.status} onChange={handleChange} required>
                <option value="EMITIDA">Emitida</option>
                <option value="PARCIALMENTE_PAGA">Parcial</option>
                <option value="PAGA">Paga</option>
                <option value="VENCIDA">Vencida</option>
                <option value="CANCELADA">Cancelada</option>
              </Select>
              <Select name="formaPagamento" label="Forma de Pagamento" value={form.formaPagamento} onChange={handleChange} required>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="MULTICAIXA">Multicaixa</option>
                <option value="TRANSFERENCIA">Transferência</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CONVENIO">Convénio</option>
                <option value="ISENTO">Isento</option>
                <option value="OUTRO">Outro</option>
              </Select>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Fatura cadastrada com sucesso!</div>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Emitir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageContent>
    </MainLayout>
  );
}
