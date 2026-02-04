"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovaColetaPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        tipo: "COLETA_RESIDUOS",
        descricao: "",
        data: "",
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
            await api.post("/servicos-gerais", form);
            router.push("/servicos-gerais");
        } catch (err: any) {
            setError(err.message || "Erro ao registrar coleta");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Nova Coleta de Resíduos" description="Registrar coleta de resíduos hospitalares" />
            <PageContent>
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Dados da Coleta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Select
                                name="tipo"
                                label="Classe de Resíduo"
                                value={form.tipo}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "CLASSE_A", label: "Classe A (Infectantes)" },
                                    { value: "CLASSE_B", label: "Classe B (Químicos)" },
                                    { value: "CLASSE_E", label: "Classe E (Perfurocortantes)" },
                                    { value: "CLASSE_D", label: "Classe D (Comuns)" },
                                ]}
                            />
                            <Input name="data" label="Data da Coleta" type="date" value={form.data} onChange={handleChange} required />
                            <Input name="descricao" label="Peso Estimado (kg) / Observações" value={form.descricao} onChange={handleChange} required />

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" /> : "Registrar Coleta"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
