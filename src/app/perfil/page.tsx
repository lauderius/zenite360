'use client';

import React, { useState } from 'react';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Alert } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function PerfilPage() {
    const { funcionario, usuario } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Estados do formulário
    const [profileData, setProfileData] = useState({
        nomeCompleto: funcionario?.nomeCompleto || usuario?.name || '',
        email: funcionario?.email || usuario?.email || '',
        telefone: funcionario?.telefone1 || '',
        cargo: funcionario?.cargo || '',
        departamento: typeof funcionario?.departamento === 'object' && funcionario?.departamento?.nome ? funcionario.departamento.nome : '',
        especialidade: funcionario?.especialidade || '',
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simular salvamento
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <MainLayout>
            <PageHeader
                title="Meu Perfil"
                description="Gerir informações da sua conta"
                actions={
                    <Button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        isLoading={isSaving}
                    >
                        <Icons.Edit size={16} />
                        {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
                    </Button>
                }
            />

            <PageContent>
                {showSuccess && (
                    <Alert variant="success" className="mb-6">
                        <Icons.Check className="w-4 h-4" />
                        Perfil atualizado com sucesso!
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Esquerda - Avatar e Info Básica */}
                    <Card className="lg:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-black text-5xl shadow-lg shadow-brand-500/20 mb-4">
                                    {funcionario?.nomeCompleto?.charAt(0) || usuario?.name?.charAt(0) || 'U'}
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {funcionario?.nomeCompleto || usuario?.name || 'Utilizador'}
                                </h2>

                                <Badge variant="primary" className="mb-4">
                                    {funcionario?.cargo || 'Utilizador'}
                                </Badge>

                                <div className="w-full space-y-3 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Icons.Mail size={16} className="text-brand-500" />
                                        <span className="truncate">{funcionario?.email || usuario?.email || 'N/A'}</span>
                                    </div>

                                    {funcionario?.telefone1 && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Icons.Phone size={16} className="text-brand-500" />
                                            <span>{funcionario.telefone1}</span>
                                        </div>
                                    )}

                                    {funcionario?.departamento && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Icons.Building size={16} className="text-brand-500" />
                                            <span>{typeof funcionario.departamento === 'object' ? funcionario.departamento.nome : funcionario.departamento}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-emerald-600 font-bold">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coluna Direita - Informações Detalhadas */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações Pessoais */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.User size={20} className="text-sky-600" />
                                    Informações Pessoais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nome Completo"
                                        value={profileData.nomeCompleto}
                                        onChange={(e) => setProfileData({ ...profileData, nomeCompleto: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Telefone"
                                        value={profileData.telefone}
                                        onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Cargo"
                                        value={profileData.cargo}
                                        onChange={(e) => setProfileData({ ...profileData, cargo: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Departamento"
                                        value={profileData.departamento}
                                        onChange={(e) => setProfileData({ ...profileData, departamento: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                    <Input
                                        label="Especialidade"
                                        value={profileData.especialidade}
                                        onChange={(e) => setProfileData({ ...profileData, especialidade: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Segurança */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Lock size={20} className="text-sky-600" />
                                    Segurança
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-700 dark:text-slate-200">Alterar Senha</p>
                                        <p className="text-sm text-slate-500">Última alteração há 30 dias</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Alterar
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-700 dark:text-slate-200">Autenticação de Dois Fatores</p>
                                        <p className="text-sm text-slate-500">Adiciona uma camada extra de segurança</p>
                                    </div>
                                    <Badge variant="default">Desativado</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Atividade Recente */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Activity size={20} className="text-sky-600" />
                                    Atividade Recente
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { acao: 'Login no sistema', data: 'Hoje às 08:30', icon: 'LogIn' },
                                        { acao: 'Atualização de perfil', data: 'Ontem às 14:20', icon: 'Edit' },
                                        { acao: 'Consulta registrada', data: '2 dias atrás', icon: 'FileText' },
                                    ].map((item, index) => {
                                        const IconComponent = Icons[item.icon as keyof typeof Icons];
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <div className="p-2 bg-brand-500/10 rounded-lg">
                                                    <IconComponent size={16} className="text-brand-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.acao}</p>
                                                    <p className="text-xs text-slate-500">{item.data}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageContent>
        </MainLayout>
    );
}
