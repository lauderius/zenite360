"use client";

import React, { useState, useEffect } from "react";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Table, Badge, Spinner, Button, Input } from "@/components/ui";
import { Icons } from "@/components/ui/icons";
import { api } from "@/services/api";

interface Exame {
    id: number;
    codigo: string;
    paciente: string;
    tipoExame: string;
    categoria: string;
    dataSolicitacao: string;
    dataResultado: string | null;
    solicitante: string;
    status: string;
    resultado: string | null;
    interpretacao: string | null;
}

export default function ResultadosLaboratorioPage() {
    const [exames, setExames] = useState<Exame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchResultados() {
            try {
                const response = await api.get<{ data: Exame[] }>("/laboratorio?status=Laudado");
                setExames(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar resultados:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchResultados();
    }, []);

    const examesFiltrados = exames.filter(e =>
        e.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <PageHeader title="Resultados de Exames" description="Visualização e emissão de laudos laboratoriais" />
            <PageContent>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Exames Concluídos</CardTitle>
                        <div className="w-72">
                            <Input
                                placeholder="Pesquisar paciente ou código..."
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
                                            <th className="px-4 py-3 text-left">Paciente</th>
                                            <th className="px-4 py-3 text-left">Exame</th>
                                            <th className="px-4 py-3 text-center">Data Res.</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {examesFiltrados.map((exame) => (
                                            <tr key={exame.id} className="border-b hover:bg-slate-50">
                                                <td className="px-4 py-3 font-mono text-sky-600">{exame.codigo}</td>
                                                <td className="px-4 py-3 font-medium">{exame.paciente}</td>
                                                <td className="px-4 py-3">{exame.tipoExame}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {exame.dataResultado ? new Date(exame.dataResultado).toLocaleDateString() : "-"}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="success">Concluído</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="outline" size="sm">
                                                        <Icons.FileText size={14} className="mr-1" />
                                                        Ver Laudo
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {examesFiltrados.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-slate-500">Nenhum resultado encontrado.</td>
                                            </tr>
                                        )}
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
