"use client";

import React, { useState, useEffect } from "react";
import { MainLayout, PageHeader, PageContent, GridLayout } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Spinner, Button } from "@/components/ui";
import { Icons } from "@/components/ui/icons";
import { api } from "@/services/api";

export default function EstatisticasMorguePage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await api.get<any>("/casa-mortuaria/dashboard");
                setStats(response);
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <MainLayout>
            <PageHeader title="Estatísticas e Relatórios" description="Análise de dados da casa mortuária" />
            <PageContent>
                {isLoading ? (
                    <div className="flex justify-center p-12"><Spinner size="lg" /></div>
                ) : (
                    <div className="space-y-6">
                        <GridLayout cols={3}>
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Mortos por Causa</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {stats.distribuicaoPorCausa?.map((item: any) => (
                                            <div key={item.causa} className="flex justify-between items-center text-sm">
                                                <span>{item.causa}</span>
                                                <span className="font-bold">{item.quantidade}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Por Gênero</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {stats.distribuicaoPorGenero?.map((item: any) => (
                                            <div key={item.genero} className="flex justify-between items-center text-sm">
                                                <span>{item.genero}</span>
                                                <span className="font-bold">{item.quantidade}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Eficiência</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-sky-600">{stats.tempoMedioConservacao}h</p>
                                        <p className="text-xs text-slate-500">Tempo médio de conservação</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </GridLayout>

                        <Card>
                            <CardHeader><CardTitle>Histórico Mensal</CardTitle></CardHeader>
                            <CardContent className="h-64 flex items-center justify-center border-t text-slate-400 italic">
                                Gráfico de tendência mensal (Em desenvolvimento)
                            </CardContent>
                        </Card>
                    </div>
                )}
            </PageContent>
        </MainLayout>
    );
}
