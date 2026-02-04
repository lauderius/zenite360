'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  RefreshCw,
  ShoppingCart,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Printer,
  ChevronDown
} from 'lucide-react';
import { MainLayout, PageHeader, PageContent, GridLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal, Select, Spinner } from '@/components/ui';
import { api } from '@/services/api';

export default function FarmaciaPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Stock Item Form State
  const initialFormData = {
    nome_artigo: '',
    codigo_artigo: '',
    categoria: 'Medicamentos',
    localizacao_stock: 'Farmacia_Central',
    quantidade_stock: 0,
    stock_minimo: 10,
    preco_venda: 0
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchStock = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: any[] }>(`/stock${query ? `?q=${query}` : ""}`);
      setStock(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar stock:", error);
      setStock([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStock(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/stock/${editingId}`, formData);
      } else {
        await api.post("/stock", formData);
      }
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData(initialFormData);
      fetchStock(searchTerm);
    } catch (error) {
      console.error('Erro ao processar artigo de stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      nome_artigo: item.nome_artigo,
      codigo_artigo: item.codigo_artigo,
      categoria: item.categoria || 'Medicamentos',
      localizacao_stock: item.localizacao_stock || 'Farmacia_Central',
      quantidade_stock: Number(item.quantidade_stock),
      stock_minimo: Number(item.stock_minimo),
      preco_venda: Number(item.preco_venda)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este item do stock?')) return;
    try {
      await api.delete(`/stock/${id}`);
      fetchStock(searchTerm);
    } catch (error) {
      console.error("Erro ao eliminar artigo:", error);
    }
  };

  const criticalItems = stock.filter(item => Number(item.quantidade_stock) <= Number(item.stock_minimo));

  return (
    <MainLayout>
      <PageHeader
        title="Gestão de Farmácia e Stock"
        description="Controlo de inventário hospitalar, reposições e validade de fármacos."
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('/api/pdf/stock', '_blank')}
              variant="outline" size="sm" className="rounded-xl border-white/5 hover:bg-white/5"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Inventário
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-brand border-none rounded-xl font-bold px-6 shadow-lg shadow-brand-500/20 group"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        }
      />

      <PageContent>
        {/* Modal Novo Artigo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditing(false);
            setFormData(initialFormData);
          }}
          title={isEditing ? "Editar Artigo de Stock" : "Adicionar Artigo ao Stock"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Artigo"
                required
                value={formData.nome_artigo}
                onChange={(e) => setFormData({ ...formData, nome_artigo: e.target.value })}
              />
              <Input
                label="Código/SKU"
                required
                value={formData.codigo_artigo}
                onChange={(e) => setFormData({ ...formData, codigo_artigo: e.target.value })}
              />
              <Select
                label="Categoria"
                options={[
                  { value: 'Medicamentos', label: 'Medicamentos' },
                  { value: 'Consumíveis', label: 'Consumíveis' },
                  { value: 'Equipamentos', label: 'Equipamentos' },
                  { value: 'Reagentes', label: 'Reagentes' },
                  { value: 'Outros', label: 'Outros' }
                ]}
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
              <Select
                label="Localização"
                options={[
                  { value: 'Farmacia_Central', label: 'Farmácia Central' },
                  { value: 'Bloco_Operatorio', label: 'Bloco Operatório' },
                  { value: 'Consultorios', label: 'Consultórios' },
                  { value: 'Laboratorio', label: 'Laboratório' },
                  { value: 'Deposito_Central', label: 'Depósito Central' }
                ]}
                value={formData.localizacao_stock}
                onChange={(e) => setFormData({ ...formData, localizacao_stock: e.target.value })}
              />
              <Input
                label="Quantidade Inicial"
                type="number"
                required
                value={formData.quantidade_stock}
                onChange={(e) => setFormData({ ...formData, quantidade_stock: Number(e.target.value) })}
              />
              <Input
                label="Stock Mínimo"
                type="number"
                required
                value={formData.stock_minimo}
                onChange={(e) => setFormData({ ...formData, stock_minimo: Number(e.target.value) })}
              />
              <Input
                label="Preço de Venda (AOA)"
                type="number"
                required
                value={formData.preco_venda}
                onChange={(e) => setFormData({ ...formData, preco_venda: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="gradient-brand border-none" isLoading={isSubmitting}>Salvar Artigo</Button>
            </div>
          </form>
        </Modal>
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total de Itens"
            value={stock.length.toString()}
            trend="+2.4%"
            icon={<Package className="w-6 h-6 text-brand-400" />}
            color="brand"
          />
          <KPICard
            title="Stock Crítico"
            value={criticalItems.length.toString()}
            badge={criticalItems.length > 0 ? "Urgente" : ""}
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
            color="red"
            pulse={criticalItems.length > 0}
          />
          <KPICard
            title="Stock Baixo"
            value="45"
            trend="Nível Alerta"
            icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
            color="amber"
          />
          <KPICard
            title="Pedidos Pendentes"
            value="08"
            warning="3 em atraso"
            icon={<Clock className="w-6 h-6 text-indigo-400" />}
            color="indigo"
          />
        </div>

        {/* Filters Section */}
        <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row gap-6 items-center border-brand-500/5">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
            <input
              className="input-premium pl-12 h-14 text-sm"
              placeholder="Pesquisar fármaco, lote ou código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector (SBU/SF)</label>
              <select className="input-premium h-14 px-6 text-sm bg-slate-800 border-slate-600 text-slate-100 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/30">
                <optgroup label="Seleccionar Sector" className="bg-slate-900">
                  <option value="">Todos os Sectores</option>
                  <option value="Farmacia_Central">SF - Farmácia Central</option>
                  <option value="Emergência">SBU - Emergência</option>
                  <option value="Pediatria">SBU - Pediatria</option>
                </optgroup>
              </select>
            </div>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/5 hover:bg-white/5 mt-auto">
              <Filter className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Inventory Table Container */}
        <Card className="glass-card border-none rounded-3xl overflow-hidden min-h-[400px]">
          <CardHeader className="bg-white/5 border-b border-white/5 p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">Inventário Detalhado</CardTitle>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic flex items-center gap-2">
                <RefreshCw className={`w-3 h-3 text-brand-500 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Sincronizando...' : 'Sincronizado'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white rounded-xl">
                <FileText className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white rounded-xl">
                <FileText className="w-4 h-4 mr-2" /> Excel
              </Button>
            </div>
          </CardHeader>

          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-5">Item Hospitalar</th>
                    <th className="px-6 py-5">Categoria</th>
                    <th className="px-6 py-5 text-center">Stock Atual</th>
                    <th className="px-6 py-5">Unidade</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {stock.map((item) => (
                    <StockRow
                      key={item.id}
                      name={item.nome_artigo}
                      id={item.id}
                      sku={item.codigo_artigo}
                      category={item.categoria}
                      quantity={item.quantidade_stock}
                      unit={item.unidade_medida}
                      isCritical={Number(item.quantidade_stock) <= Number(item.stock_minimo)}
                      isWarning={Number(item.quantidade_stock) <= Number(item.stock_minimo) * 1.5}
                      onDelete={() => handleDelete(item.id)}
                      onEdit={() => handleEdit(item)}
                    />
                  ))}
                  {stock.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum item em stock</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && stock.length > 0 && (
            <div className="bg-white/5 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Mostrando <span className="text-slate-200">{stock.length} Itens</span>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled className="rounded-xl border-white/5">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="default" className="w-10 h-10 rounded-xl font-black gradient-brand border-none">1</Button>
                <Button variant="outline" size="icon" className="rounded-xl border-white/5">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </PageContent>
    </MainLayout>
  );
}

function KPICard({ title, value, trend, badge, warning, icon, color, pulse }: any) {
  const colorMap: any = {
    brand: 'border-brand-500/20 bg-brand-500/5',
    red: 'border-red-500/20 bg-red-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    indigo: 'border-indigo-500/20 bg-indigo-500/5',
  };

  return (
    <Card className={`glass-card border-none rounded-3xl p-6 relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </Badge>
        )}
        {badge && (
          <Badge className={`bg-red-500/10 text-red-500 border-none font-black ${pulse ? 'animate-pulse' : ''}`}>
            {badge}
          </Badge>
        )}
        {warning && (
          <Badge className="bg-red-500 text-white border-none font-black uppercase text-[10px]">
            {warning}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-white">{value}</h3>
      </div>
    </Card>
  );
}

function StockRow({ name, id, sku, category, quantity, unit, isCritical, isWarning, onDelete, onEdit }: any) {
  const status = isCritical ? 'Crítico' : isWarning ? 'Baixo' : 'Estável';
  const statusColor = isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500';
  const bgStatus = isCritical ? 'bg-red-500/10' : isWarning ? 'bg-amber-500/10' : 'bg-emerald-500/10';

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-8 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-brand-400 transition-colors">{name}</span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 font-mono">{sku}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <Badge variant="secondary" className="border-white/5 text-slate-500 font-bold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl">
          {category}
        </Badge>
      </td>
      <td className="px-6 py-5 text-center">
        <span className={`text-lg font-black tracking-widest ${statusColor}`}>
          {quantity}
        </span>
      </td>
      <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">
        {unit}
      </td>
      <td className="px-6 py-5 text-center">
        <Badge className={`${bgStatus} ${statusColor} border-none font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full`}>
          {status}
        </Badge>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          {(isCritical || isWarning) && (
            <Button className="h-10 px-6 rounded-xl bg-brand-500 text-white border-none font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-all">
              <ShoppingCart className="w-3.5 h-3.5 mr-2" /> Reposição
            </Button>
          )}
          <div className="relative group/menu">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/10 text-slate-500">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2 text-left">
              <button
                onClick={onEdit}
                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                Editar Artigo
              </button>
              <button
                onClick={onDelete}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
              >
                Eliminar Artigo
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}