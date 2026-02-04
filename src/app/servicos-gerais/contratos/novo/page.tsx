"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select, Textarea } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoContratoPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        tipo: "LIMPEZA",
        descricao: "",
        data: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await api.post("/servicos-gerais", form);
            router.push("/servicos-gerais");
        } catch (err: any) {
            setError(err.message || "Erro ao criar contrato");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Novo Contrato de Serviço" description="Cadastrar novo contrato ou serviço" />
            <PageContent>
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Dados do Contrato</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Select
                                name="tipo"
                                label="Tipo de Serviço"
                                value={form.tipo}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "LIMPEZA", label: "Limpeza" },
                                    { value: "SEGURANÇA", label: "Segurança" },
                                    { value: "MANUTENÇÃO", label: "Manutenção Predial" },
                                    { value: "ALIMENTAÇÃO", label: "Alimentação" },
                                    { value: "LAVANDERIA", label: "Lavanderia" },
                                ]}
                            />
                            <Input name="data" label="Data de Início" type="date" value={form.data} onChange={handleChange} required />
                            <Textarea name="descricao" label="Descrição do Objeto" value={form.descricao} onChange={handleChange} required />

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" /> : "Criar Contrato"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
