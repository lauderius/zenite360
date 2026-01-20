'use client';

import React, { useState } from 'react';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Button, Input, Select, Tabs, Badge, Alert } from '@/components/ui';
import { Icons } from '@/components/ui/Icons';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfiguracoesPage() {
  const { funcionario } = useAuth();
  const [activeSection, setActiveSection] = useState('geral');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados do formulário
  const [hospitalConfig, setHospitalConfig] = useState({
    nome: 'Hospital Central de Luanda',
    sigla: 'HCL',
    nif: '5000123456',
    telefone: '+244 222 123 456',
    email: 'geral@hcl.co.ao',
    endereco: 'Av. 4 de Fevereiro, Luanda, Angola',
    website: 'www.hcl.co.ao',
  });

  const [sistemaConfig, setSistemaConfig] = useState({
    fusoHorario: 'Africa/Luanda',
    formatoData: 'dd/MM/yyyy',
    moeda: 'AOA',
    idioma: 'pt-AO',
    sessaoTimeout: '30',
    backupAutomatico: true,
    notificacoesEmail: true,
    autenticacaoDoisFatores: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const menuItems = [
    { id: 'geral', label: 'Dados Gerais', icon: 'Building' },
    { id: 'sistema', label: 'Sistema', icon: 'Settings' },
    { id: 'seguranca', label: 'Segurança', icon: 'Lock' },
    { id: 'notificacoes', label: 'Notificações', icon: 'Bell' },
    { id: 'integracao', label: 'Integrações', icon: 'ExternalLink' },
    { id: 'backup', label: 'Backup', icon: 'Download' },
  ];

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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
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
                      value={hospitalConfig.nome}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, nome: e.target.value })}
                    />
                    <Input
                      label="Sigla"
                      value={hospitalConfig.sigla}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, sigla: e.target.value })}
                    />
                    <Input
                      label="NIF"
                      value={hospitalConfig.nif}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, nif: e.target.value })}
                    />
                    <Input
                      label="Telefone"
                      value={hospitalConfig.telefone}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, telefone: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={hospitalConfig.email}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, email: e.target.value })}
                    />
                    <Input
                      label="Website"
                      value={hospitalConfig.website}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, website: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Endereço"
                    value={hospitalConfig.endereco}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, endereco: e.target.value })}
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
                      value={sistemaConfig.fusoHorario}
                      onChange={(e) => setSistemaConfig({ ...sistemaConfig, fusoHorario: e.target.value })}
                      options={[
                        { value: 'Africa/Luanda', label: 'Africa/Luanda (WAT)' },
                      ]}
                    />
                    <Select
                      label="Formato de Data"
                      value={sistemaConfig.formatoData}
                      onChange={(e) => setSistemaConfig({ ...sistemaConfig, formatoData: e.target.value })}
                      options={[
                        { value: 'dd/MM/yyyy', label: 'DD/MM/AAAA' },
                        { value: 'MM/dd/yyyy', label: 'MM/DD/AAAA' },
                        { value: 'yyyy-MM-dd', label: 'AAAA-MM-DD' },
                      ]}
                    />
                    <Select
                      label="Moeda"
                      value={sistemaConfig.moeda}
                      onChange={(e) => setSistemaConfig({ ...sistemaConfig, moeda: e.target.value })}
                      options={[
                        { value: 'AOA', label: 'Kwanza (Kz)' },
                        { value: 'USD', label: 'Dólar (USD)' },
                      ]}
                    />
                    <Select
                      label="Idioma"
                      value={sistemaConfig.idioma}
                      onChange={(e) => setSistemaConfig({ ...sistemaConfig, idioma: e.target.value })}
                      options={[
                        { value: 'pt-AO', label: 'Português (Angola)' },
                        { value: 'pt-BR', label: 'Português (Brasil)' },
                        { value: 'en', label: 'English' },
                      ]}
                    />
                    <Select
                      label="Timeout de Sessão"
                      value={sistemaConfig.sessaoTimeout}
                      onChange={(e) => setSistemaConfig({ ...sistemaConfig, sessaoTimeout: e.target.value })}
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
                        checked={sistemaConfig.autenticacaoDoisFatores}
                        onChange={(e) => setSistemaConfig({ ...sistemaConfig, autenticacaoDoisFatores: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200">Políticas de Senha</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Tamanho Mínimo"
                        options={[
                          { value: '6', label: '6 caracteres' },
                          { value: '8', label: '8 caracteres' },
                          { value: '10', label: '10 caracteres' },
                          { value: '12', label: '12 caracteres' },
                        ]}
                      />
                      <Select
                        label="Expiração de Senha"
                        options={[
                          { value: '30', label: '30 dias' },
                          { value: '60', label: '60 dias' },
                          { value: '90', label: '90 dias' },
                          { value: '0', label: 'Nunca' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200">Bloqueio de Conta</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Tentativas Máximas"
                        options={[
                          { value: '3', label: '3 tentativas' },
                          { value: '5', label: '5 tentativas' },
                          { value: '10', label: '10 tentativas' },
                        ]}
                      />
                      <Select
                        label="Tempo de Bloqueio"
                        options={[
                          { value: '15', label: '15 minutos' },
                          { value: '30', label: '30 minutos' },
                          { value: '60', label: '1 hora' },
                          { value: '0', label: 'Até desbloqueio manual' },
                        ]}
                      />
                    </div>
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
                  {[
                    { id: 'email', label: 'Notificações por Email', desc: 'Receber alertas importantes por email' },
                    { id: 'estoque', label: 'Alertas de Estoque', desc: 'Notificar quando estoque estiver baixo' },
                    { id: 'agenda', label: 'Lembretes de Agenda', desc: 'Notificar sobre consultas agendadas' },
                    { id: 'manutencao', label: 'Alertas de Manutenção', desc: 'Notificar sobre manutenções programadas' },
                    { id: 'fatura', label: 'Alertas de Faturas', desc: 'Notificar sobre faturas vencidas' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === 'integracao' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.ExternalLink size={20} className="text-sky-600" />
                    Integrações
                  </CardTitle>
                  <CardDescription>
                    Conexões com sistemas externos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'sms', label: 'Gateway SMS', desc: 'Envio de SMS para pacientes', status: 'connected' },
                    { id: 'email', label: 'Servidor de Email', desc: 'SMTP para envio de emails', status: 'connected' },
                    { id: 'agt', label: 'AGT', desc: 'Integração com Administração Geral Tributária', status: 'disconnected' },
                    { id: 'seguros', label: 'Seguradoras', desc: 'API de validação de convénios', status: 'disconnected' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {item.status === 'connected' ? 'Configurar' : 'Conectar'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
                        checked={sistemaConfig.backupAutomatico}
                        onChange={(e) => setSistemaConfig({ ...sistemaConfig, backupAutomatico: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200">Backups Recentes</h4>
                    {[
                      { data: '15/01/2024 02:00', tamanho: '2.3 GB', status: 'success' },
                      { data: '14/01/2024 02:00', tamanho: '2.2 GB', status: 'success' },
                      { data: '13/01/2024 02:00', tamanho: '2.2 GB', status: 'success' },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icons.Check className="w-5 h-5 text-emerald-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{backup.data}</p>
                            <p className="text-xs text-slate-500">{backup.tamanho}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Icons.Download size={14} />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icons.Refresh size={14} />
                            Restaurar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Icons.Download size={16} />
                      Backup Manual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <Button onClick={handleSave} isLoading={isSaving}>
                <Icons.Save size={16} />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </PageContent>
    </MainLayout>
  );
}