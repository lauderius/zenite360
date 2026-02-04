"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Spinner, Select } from "@/components/ui";
import { api } from "@/services/api";

export default function NovoRegistroMorguePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        nomeCompleto: "",
        dataHoraObito: "",
        causaObito: "NATURAL",
        gaveta: "",
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
            await api.post("/casa-mortuaria/registros", form);
            router.push("/casa-mortuaria");
        } catch (err: any) {
            setError(err.message || "Erro ao registrar óbito");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Novo Registro de Óbito" description="Cadastrar entrada na casa mortuária" />
            <PageContent>
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Dados do Falecido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input name="nomeCompleto" label="Nome Completo" value={form.nomeCompleto} onChange={handleChange} required />
                            <Input name="dataHoraObito" label="Data/Hora do Óbito" type="datetime-local" value={form.dataHoraObito} onChange={handleChange} required />
                            <Select
                                name="causaObito"
                                label="Causa do Óbito"
                                value={form.causaObito}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "NATURAL", label: "Natural" },
                                    { value: "ACIDENTAL", label: "Acidental" },
                                    { value: "VIOLENTA", label: "Violenta" },
                                    { value: "INDETERMINADA", label: "Indeterminada" },
                                ]}
                            />
                            <Input name="gaveta" label="Número da Gaveta" value={form.gaveta} onChange={handleChange} required />

                            {error && <div className="text-red-600 text-sm">{error}</div>}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner size="sm" /> : "Registrar"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
