"use client";

import React, { useState, useEffect } from "react";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner, Button, Input } from "@/components/ui";
import { Icons } from "@/components/ui/icons";
import { api } from "@/services/api";

interface Equipamento {
    id: number;
    codigo: string;
    nome: string;
    categoria: string;
    departamento: string;
    status: string;
    fabricante?: string;
    modelo?: string;
}

export default function EquipamentosManutencaoPage() {
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchEquipamentos() {
            try {
                const response = await api.get<{ data: Equipamento[] }>("/patrimonio/ativos");
                setEquipamentos(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar equipamentos:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEquipamentos();
    }, []);

    const filtrados = equipamentos.filter(e =>
        e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <PageHeader title="Equipamentos Hospitalares" description="Monitorização e gestão técnica de equipamentos" />
            <PageContent>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Inventário de Equipamentos</CardTitle>
                        <div className="w-72">
                            <Input
                                placeholder="Pesquisar equipamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Icons.Search size={16} />}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Spinner size="lg" /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left">Código</th>
                                            <th className="px-4 py-3 text-left">Equipamento</th>
                                            <th className="px-4 py-3 text-left">Categoria</th>
                                            <th className="px-4 py-3 text-left">Departamento</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtrados.map((eq) => (
                                            <tr key={eq.id} className="border-b hover:bg-slate-50">
                                                <td className="px-4 py-3 font-mono text-sky-600">{eq.codigo}</td>
                                                <td className="px-4 py-3 font-medium">{eq.nome}</td>
                                                <td className="px-4 py-3">{eq.categoria}</td>
                                                <td className="px-4 py-3">{eq.departamento}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant={eq.status === "OPERACIONAL" ? "success" : "warning"}>
                                                        {eq.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="outline" size="sm">Histórico</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </PageContent>
        </MainLayout>
    );
}
