'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout, PageHeader, PageContent } from '@/components/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Button, Input, Select, Badge, Alert } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export default function ConfiguracoesPage() {
  const { funcionario } = useAuth();
  const [activeSection, setActiveSection] = useState('geral');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    id: 1,
    hospital_nome: '',
    hospital_sigla: '',
    hospital_nif: '',
    hospital_telefone: '',
    hospital_email: '',
    hospital_website: '',
    hospital_endereco: '',
    sistema_fuso_horario: 'Africa/Luanda',
    sistema_formato_data: 'dd/MM/yyyy',
    sistema_moeda: 'AOA',
    sistema_idioma: 'pt-AO',
    sistema_timeout_sessao: '30',
    sistema_backup_auto: true,
    sistema_notificacoes_email: true,
    sistema_auth_2fa: false,
    agt_endpoint: '',
    agt_app_id: '',
    agt_app_key: '',
    agt_token: '',
    agt_ambiente: 'homologacao',
    seguradoras_status: 'disconnected',
    seguradoras_endpoint: '',
    seguradoras_api_key: '',
    smtp_host: '',
    smtp_port: null as number | null,
    smtp_user: '',
    smtp_pass: '',
    smtp_encryption: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const result = await api.get<{ success: boolean; data: any }>('/configuracoes');
      if (result.success) {
        // Initialize with defaults to avoid null issues in inputs
        const safeData = { ...result.data };
        Object.keys(safeData).forEach(key => {
          if (safeData[key] === null) safeData[key] = '';
        });
        setFormData(prev => ({ ...prev, ...safeData }));
      } else {
        console.warn('Configurações não carregadas:', result);
        // setError('Erro ao carregar configurações');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const result = await api.put<{ success: boolean; data: any }>('/configuracoes', formData);
      if (result.success) {
        setFormData(result.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError('Erro ao salvar configurações');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const menuItems = [
    { id: 'geral', label: 'Dados Gerais', icon: 'Building' },
    { id: 'sistema', label: 'Sistema', icon: 'Settings' },
    { id: 'seguranca', label: 'Segurança', icon: 'Lock' },
    { id: 'notificacoes', label: 'Notificações', icon: 'Bell' },
    { id: 'integracao', label: 'Integrações', icon: 'ExternalLink' },
    { id: 'backup', label: 'Backup', icon: 'Download' },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Configurações" description="Carregando..." />
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        </PageContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Configurações"
        description="Configurações gerais do sistema"
      />

      <PageContent>
        {showSuccess && (
          <Alert variant="success" className="mb-6">
            <Icons.Check className="w-4 h-4" />
            Configurações salvas com sucesso!
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            <Icons.AlertCircle className="w-4 h-4" />
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu Lateral */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = Icons[item.icon as keyof typeof Icons];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === item.id
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                    >
                      <IconComponent size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Conteúdo */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'geral' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Building size={20} className="text-sky-600" />
                    Dados do Hospital
                  </CardTitle>
                  <CardDescription>
                    Informações básicas da instituição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome do Hospital"
                      value={formData.hospital_nome || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_nome: e.target.value })}
                    />
                    <Input
                      label="Sigla"
                      value={formData.hospital_sigla || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_sigla: e.target.value })}
                    />
                    <Input
                      label="NIF"
                      value={formData.hospital_nif || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_nif: e.target.value })}
                    />
                    <Input
                      label="Telefone"
                      value={formData.hospital_telefone || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_telefone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.hospital_email || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_email: e.target.value })}
                    />
                    <Input
                      label="Website"
                      value={formData.hospital_website || ''}
                      onChange={(e) => setFormData({ ...formData, hospital_website: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Endereço"
                    value={formData.hospital_endereco || ''}
                    onChange={(e) => setFormData({ ...formData, hospital_endereco: e.target.value })}
                  />
                </CardContent>
              </Card>
            )}

            {activeSection === 'sistema' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Settings size={20} className="text-sky-600" />
                    Configurações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Preferências regionais e de funcionamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Fuso Horário"
                      value={formData.sistema_fuso_horario || 'Africa/Luanda'}
                      onChange={(e) => setFormData({ ...formData, sistema_fuso_horario: e.target.value })}
                      options={[
                        { value: 'Africa/Luanda', label: 'Africa/Luanda (WAT)' },
                      ]}
                    />
                    <Select
                      label="Formato de Data"
                      value={formData.sistema_formato_data || 'dd/MM/yyyy'}
                      onChange={(e) => setFormData({ ...formData, sistema_formato_data: e.target.value })}
                      options={[
                        { value: 'dd/MM/yyyy', label: 'DD/MM/AAAA' },
                        { value: 'MM/dd/yyyy', label: 'MM/DD/AAAA' },
                        { value: 'yyyy-MM-dd', label: 'AAAA-MM-DD' },
                      ]}
                    />
                    <Select
                      label="Moeda"
                      value={formData.sistema_moeda || 'AOA'}
                      onChange={(e) => setFormData({ ...formData, sistema_moeda: e.target.value })}
                      options={[
                        { value: 'AOA', label: 'Kwanza (Kz)' },
                        { value: 'USD', label: 'Dólar (USD)' },
                      ]}
                    />
                    <Select
                      label="Idioma"
                      value={formData.sistema_idioma || 'pt-AO'}
                      onChange={(e) => setFormData({ ...formData, sistema_idioma: e.target.value })}
                      options={[
                        { value: 'pt-AO', label: 'Português (Angola)' },
                        { value: 'pt-BR', label: 'Português (Brasil)' },
                        { value: 'en', label: 'English' },
                      ]}
                    />
                    <Select
                      label="Timeout de Sessão"
                      value={formData.sistema_timeout_sessao || '30'}
                      onChange={(e) => setFormData({ ...formData, sistema_timeout_sessao: e.target.value })}
                      options={[
                        { value: '15', label: '15 minutos' },
                        { value: '30', label: '30 minutos' },
                        { value: '60', label: '1 hora' },
                        { value: '120', label: '2 horas' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'seguranca' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Lock size={20} className="text-sky-600" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Configurações de segurança e acesso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">Autenticação de Dois Fatores</p>
                      <p className="text-sm text-slate-500">Adiciona uma camada extra de segurança</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sistema_auth_2fa}
                        onChange={(e) => setFormData({ ...formData, sistema_auth_2fa: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'notificacoes' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Bell size={20} className="text-sky-600" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Configurações de alertas e notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">Notificações por Email</p>
                      <p className="text-sm text-slate-500">Receber alertas importantes por email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sistema_notificacoes_email}
                        onChange={(e) => setFormData({ ...formData, sistema_notificacoes_email: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'integracao' && (
              <div className="space-y-6">
                {/* AGT */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icons.ExternalLink size={20} className="text-sky-600" />
                          Integração AGT
                        </CardTitle>
                        <CardDescription>
                          Administração Geral Tributária (Angola)
                        </CardDescription>
                      </div>
                      <Badge variant={formData.agt_token ? 'success' : 'outline'}>
                        {formData.agt_token ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Endpoint da API"
                        placeholder="https://api.agt.gv.ao/v1"
                        value={formData.agt_endpoint || ''}
                        onChange={(e) => setFormData({ ...formData, agt_endpoint: e.target.value })}
                      />
                      <Select
                        label="Ambiente"
                        value={formData.agt_ambiente || 'homologacao'}
                        onChange={(e) => setFormData({ ...formData, agt_ambiente: e.target.value })}
                        options={[
                          { value: 'homologacao', label: 'Homologação (Testes)' },
                          { value: 'producao', label: 'Produção' },
                        ]}
                      />
                      <Input
                        label="App ID"
                        value={formData.agt_app_id || ''}
                        onChange={(e) => setFormData({ ...formData, agt_app_id: e.target.value })}
                      />
                      <Input
                        label="App Key"
                        type="password"
                        value={formData.agt_app_key || ''}
                        onChange={(e) => setFormData({ ...formData, agt_app_key: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Token de Acesso (Manual)"
                      value={formData.agt_token || ''}
                      onChange={(e) => setFormData({ ...formData, agt_token: e.target.value })}
                    />
                  </CardContent>
                </Card>

                {/* Seguradoras */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icons.Shield size={20} className="text-sky-600" />
                          Integração com Asseguradoras
                        </CardTitle>
                        <CardDescription>
                          Validação de cartões e convênios em tempo real
                        </CardDescription>
                      </div>
                      <Badge variant={formData.seguradoras_status === 'connected' ? 'success' : 'outline'}>
                        {formData.seguradoras_status === 'connected' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="API Endpoint"
                        placeholder="https://api.seguros.ao/v1"
                        value={formData.seguradoras_endpoint || ''}
                        onChange={(e) => setFormData({ ...formData, seguradoras_endpoint: e.target.value })}
                      />
                      <Input
                        label="API Key"
                        type="password"
                        value={formData.seguradoras_api_key || ''}
                        onChange={(e) => setFormData({ ...formData, seguradoras_api_key: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SMTP / Email */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.Mail size={20} className="text-sky-600" />
                      Servidor de Email (SMTP)
                    </CardTitle>
                    <CardDescription>
                      Configuração para envio de notificações e relatórios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Host SMTP"
                          placeholder="smtp.exemplo.com"
                          value={formData.smtp_host || ''}
                          onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                        />
                      </div>
                      <Input
                        label="Porta"
                        type="number"
                        placeholder="587"
                        value={formData.smtp_port?.toString() || ''}
                        onChange={(e) => setFormData({ ...formData, smtp_port: e.target.value ? parseInt(e.target.value) : null })}
                      />
                      <Input
                        label="Usuário"
                        value={formData.smtp_user || ''}
                        onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                      />
                      <Input
                        label="Senha"
                        type="password"
                        value={formData.smtp_pass || ''}
                        onChange={(e) => setFormData({ ...formData, smtp_pass: e.target.value })}
                      />
                      <Select
                        label="Criptografia"
                        value={formData.smtp_encryption || ''}
                        onChange={(e) => setFormData({ ...formData, smtp_encryption: e.target.value })}
                        options={[
                          { value: '', label: 'Nenhuma' },
                          { value: 'tls', label: 'TLS' },
                          { value: 'ssl', label: 'SSL' },
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'backup' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.Download size={20} className="text-sky-600" />
                    Backup e Restauração
                  </CardTitle>
                  <CardDescription>
                    Gestão de backups do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">Backup Automático</p>
                      <p className="text-sm text-slate-500">Realizar backup diário às 02:00</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sistema_backup_auto}
                        onChange={(e) => setFormData({ ...formData, sistema_backup_auto: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                className="w-full md:w-auto"
                size="lg"
              >
                <Icons.Save size={18} className="mr-2" />
                Salvar Todas as Configurações
              </Button>
            </div>
          </div>
        </div>
      </PageContent>
    </MainLayout>
  );
}