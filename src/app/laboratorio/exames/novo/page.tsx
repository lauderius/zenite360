"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoExamePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        pacienteId: "",
        tipoExame: "",
        categoria: "Hematologia",
        prioridade: "Normal",
        indicacaoClinica: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await api.post("/laboratorio", form);
            router.push("/laboratorio");
        } catch (err: any) {
            setError(err.message || "Erro ao solicitar exame");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Solicitar Novo Exame" description="Preencha os dados para solicitar um exame laboratorial" />
            <PageContent>
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Dados do Exame</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input name="pacienteId" label="ID do Paciente" type="number" value={form.pacienteId} onChange={handleChange} required />
                            <Input name="tipoExame" label="Tipo de Exame" value={form.tipoExame} onChange={handleChange} required />
                            <Select
                                name="categoria"
                                label="Categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "Hematologia", label: "Hematologia" },
                                    { value: "Bioquímica", label: "Bioquímica" },
                                    { value: "Uroanálise", label: "Uroanálise" },
                                    { value: "Hormonal", label: "Hormonal" },
                                    { value: "Sorologia", label: "Sorologia" },
                                    { value: "Microbiologia", label: "Microbiologia" },
                                ]}
                            />
                            <Select
                                name="prioridade"
                                label="Prioridade"
                                value={form.prioridade}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "Normal", label: "Normal" },
                                    { value: "Urgente", label: "Urgente" },
                                    { value: "Emergência", label: "Emergência" },
                                ]}
                            />
                            <Input name="indicacaoClinica" label="Indicação Clínica" value={form.indicacaoClinica} onChange={handleChange} />

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" /> : "Solicitar"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
