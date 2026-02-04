"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoDocumentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo");

  const [form, setForm] = useState({
    tipo: tipoParam || "OFICIO",
    assunto: "",
    destinatario: "",
    prioridade: "NORMAL",
    status: "RASCUNHO",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (tipoParam) {
      setForm(prev => ({ ...prev, tipo: tipoParam }));
    }
  }, [tipoParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/secretaria/documentos", form);
      setSuccess(true);
      setTimeout(() => router.push("/secretaria"), 1000);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar documento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Novo Documento" description="Cadastrar novo documento oficial" />
      <PageContent>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Dados do Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                name="tipo"
                label="Tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                options={[
                  { value: "OFICIO", label: "Ofício" },
                  { value: "MEMORANDO", label: "Memorando" },
                  { value: "CIRCULAR", label: "Circular" },
                  { value: "PORTARIA", label: "Portaria" },
                  { value: "RESOLUCAO", label: "Resolução" },
                  { value: "DESPACHO", label: "Despacho" },
                  { value: "PARECER", label: "Parecer" },
                  { value: "COMUNICADO", label: "Comunicado" },
                  { value: "ATA", label: "Ata" },
                  { value: "CONTRATO", label: "Contrato" },
                  { value: "CONVENIO", label: "Convénio" },
                  { value: "RELATORIO", label: "Relatório" },
                  { value: "OUTROS", label: "Outros" },
                ]}
              />
              <Input name="assunto" label="Assunto" value={form.assunto} onChange={handleChange} required />
              <Input name="destinatario" label="Destinatário" value={form.destinatario} onChange={handleChange} required />
              <Select
                name="prioridade"
                label="Prioridade"
                value={form.prioridade}
                onChange={handleChange}
                required
                options={[
                  { value: "URGENTE", label: "Urgente" },
                  { value: "ALTA", label: "Alta" },
                  { value: "NORMAL", label: "Normal" },
                  { value: "BAIXA", label: "Baixa" },
                ]}
              />
              <Select
                name="status"
                label="Status"
                value={form.status}
                onChange={handleChange}
                required
                options={[
                  { value: "RASCUNHO", label: "Rascunho" },
                  { value: "EM_ELABORACAO", label: "Em Elaboração" },
                  { value: "AGUARDANDO_ASSINATURA", label: "Aguardando Assinatura" },
                  { value: "ASSINADO", label: "Assinado" },
                  { value: "ENVIADO", label: "Enviado" },
                  { value: "RECEBIDO", label: "Recebido" },
                  { value: "ARQUIVADO", label: "Arquivado" },
                  { value: "CANCELADO", label: "Cancelado" },
                ]}
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Documento cadastrado com sucesso!</div>}
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
