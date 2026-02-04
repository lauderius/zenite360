"use client";

import React, { useState, useEffect } from "react";
import { MainLayout, PageHeader, PageContent } from "@/components/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, Table, Badge, Spinner, Button, Input } from "@/components/ui";
import { Icons } from "@/components/ui/icons";
import { api } from "@/services/api";

export default function ProtocoloSecretariaPage() {
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchProtocolo() {
            try {
                const response = await api.get<{ data: any[] }>("/secretaria/documentos");
                setDocumentos(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar protocolo:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProtocolo();
    }, []);

    return (
        <MainLayout>
            <PageHeader title="Protocolo Central" description="Controle de entrada e saída de documentos" />
            <PageContent>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Histórico de Tramitações</CardTitle>
                        <div className="w-72">
                            <Input
                                placeholder="Pesquisar protocolo..."
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
                                            <th className="px-4 py-3 text-left">Nº Protocolo</th>
                                            <th className="px-4 py-3 text-left">Tipo</th>
                                            <th className="px-4 py-3 text-left">Assunto</th>
                                            <th className="px-4 py-3 text-left">Origem/Destino</th>
                                            <th className="px-4 py-3 text-center">Data</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentos.map((doc) => (
                                            <tr key={doc.id} className="border-b hover:bg-slate-50">
                                                <td className="px-4 py-3 font-mono text-sky-600">{doc.numero_protocolo || `PROT-${doc.id}`}</td>
                                                <td className="px-4 py-3 font-medium">{doc.tipo}</td>
                                                <td className="px-4 py-3">{doc.assunto}</td>
                                                <td className="px-4 py-3">{doc.destinatario || "Interno"}</td>
                                                <td className="px-4 py-3 text-center">{new Date(doc.created_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant="primary">Tramitado</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        {documentos.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-slate-500">Nenhum registro de protocolo encontrado.</td>
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
