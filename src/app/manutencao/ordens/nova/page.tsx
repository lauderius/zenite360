"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select, Textarea } from "@/components/ui";
import { api } from "@/services/api";

export default function NovaOSPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        titulo: "",
        equipamentoId: "",
        prioridade: "MEDIA",
        descricaoProblema: "",
        tipo: "CORRETIVA",
    });
    const [equipamentos, setEquipamentos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingEquips, setFetchingEquips] = useState(true);

    useEffect(() => {
        async function loadEquips() {
            try {
                const res = await api.get<{ data: any[] }>("/patrimonio/ativos");
                setEquipamentos(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setFetchingEquips(false);
            }
        }
        loadEquips();
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/patrimonio/manutencao", form);
            router.push("/manutencao");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Nova Ordem de Serviço" description="Abertura de chamado técnico para manutenção" />
            <PageContent>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Dados do Chamado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input name="titulo" label="Título do Problema" value={form.titulo} onChange={handleChange} required />

                            <Select
                                name="equipamentoId"
                                label="Equipamento"
                                value={form.equipamentoId}
                                onChange={handleChange}
                                required
                                options={equipamentos.map(e => ({ value: e.id, label: `${e.codigo} - ${e.nome}` }))}
                                placeholder={fetchingEquips ? "Carregando..." : "Selecione um equipamento"}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    name="tipo"
                                    label="Tipo de Manutenção"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    options={[
                                        { value: "CORRETIVA", label: "Corretiva" },
                                        { value: "PREVENTIVA", label: "Preventiva" },
                                        { value: "CALIBRACAO", label: "Calibração" }
                                    ]}
                                />
                                <Select
                                    name="prioridade"
                                    label="Prioridade"
                                    value={form.prioridade}
                                    onChange={handleChange}
                                    options={[
                                        { value: "URGENTE", label: "Urgente (Imediato)" },
                                        { value: "ALTA", label: "Alta" },
                                        { value: "MEDIA", label: "Média" },
                                        { value: "BAIXA", label: "Baixa" }
                                    ]}
                                />
                            </div>

                            <Textarea
                                name="descricaoProblema"
                                label="Descrição Detalhada do Problema"
                                value={form.descricaoProblema}
                                onChange={handleChange}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
                                <Button type="submit" disabled={isLoading || fetchingEquips}>
                                    {isLoading ? <Spinner size="sm" /> : "Abrir Ordem de Serviço"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
