"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoDocumentoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    tipo: "OFICIO",
    assunto: "",
    destinatario: "",
    prioridade: "NORMAL",
    status: "RASCUNHO",
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
              <Select name="tipo" label="Tipo" value={form.tipo} onChange={handleChange} required>
                <option value="OFICIO">Ofício</option>
                <option value="MEMORANDO">Memorando</option>
                <option value="CIRCULAR">Circular</option>
                <option value="PORTARIA">Portaria</option>
                <option value="RESOLUCAO">Resolução</option>
                <option value="DESPACHO">Despacho</option>
                <option value="PARECER">Parecer</option>
                <option value="COMUNICADO">Comunicado</option>
                <option value="ATA">Ata</option>
                <option value="CONTRATO">Contrato</option>
                <option value="CONVENIO">Convénio</option>
                <option value="RELATORIO">Relatório</option>
                <option value="OUTROS">Outros</option>
              </Select>
              <Input name="assunto" label="Assunto" value={form.assunto} onChange={handleChange} required />
              <Input name="destinatario" label="Destinatário" value={form.destinatario} onChange={handleChange} required />
              <Select name="prioridade" label="Prioridade" value={form.prioridade} onChange={handleChange} required>
                <option value="URGENTE">Urgente</option>
                <option value="ALTA">Alta</option>
                <option value="NORMAL">Normal</option>
                <option value="BAIXA">Baixa</option>
              </Select>
              <Select name="status" label="Status" value={form.status} onChange={handleChange} required>
                <option value="RASCUNHO">Rascunho</option>
                <option value="EM_ELABORACAO">Em Elaboração</option>
                <option value="AGUARDANDO_ASSINATURA">Aguardando Assinatura</option>
                <option value="ASSINADO">Assinado</option>
                <option value="ENVIADO">Enviado</option>
                <option value="RECEBIDO">Recebido</option>
                <option value="ARQUIVADO">Arquivado</option>
                <option value="CANCELADO">Cancelado</option>
              </Select>
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
