import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Ativo, OrdemManutencaoPatrimonio, CentralGases, AlertaGas, DashboardPatrimonio } from '@/types/administrativo';

export function usePatrimonioDashboard() {
  const [dashboard, setDashboard] = useState<DashboardPatrimonio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patrimonio/dashboard');
      setDashboard(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
}

export function useAtivos(filters?: {
  categoria?: string;
  status?: string;
  departamentoId?: number;
  search?: string;
}) {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAtivos = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(pagination.limit));
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.departamentoId) params.append('departamentoId', String(filters.departamentoId));
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get(`/patrimonio/ativos?${params.toString()}`);
      setAtivos(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ativos');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    fetchAtivos();
  }, [fetchAtivos]);

  return { ativos, pagination, isLoading, error, refetch: fetchAtivos };
}

export function useGasesMedicinais() {
  const [centrais, setCentrais] = useState<CentralGases[]>([]);
  const [alertas, setAlertas] = useState<AlertaGas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGases = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patrimonio/gases');
      setCentrais(response.data.centrais);
      setAlertas(response.data.alertas);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados de gases');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reconhecerAlerta = useCallback(async (alertaId: number, usuarioId: number) => {
    try {
      await api.put('/patrimonio/gases/alertas', {
        alertaId,
        acao: 'reconhecer',
        usuarioId,
      });
      await fetchGases();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao reconhecer alerta');
    }
  }, [fetchGases]);

  const resolverAlerta = useCallback(async (alertaId: number, usuarioId: number) => {
    try {
      await api.put('/patrimonio/gases/alertas', {
        alertaId,
        acao: 'resolver',
        usuarioId,
      });
      await fetchGases();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao resolver alerta');
    }
  }, [fetchGases]);

  useEffect(() => {
    fetchGases();
    // Polling a cada 30 segundos para atualizar dados em tempo real
    const interval = setInterval(fetchGases, 30000);
    return () => clearInterval(interval);
  }, [fetchGases]);

  return { centrais, alertas, isLoading, error, refetch: fetchGases, reconhecerAlerta, resolverAlerta };
}

export function useOrdemManutencao(id?: number) {
  const [ordem, setOrdem] = useState<OrdemManutencaoPatrimonio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdem = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await api.get(`/patrimonio/manutencao/${id}`);
      setOrdem(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ordem de manutenção');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const criarOrdem = useCallback(async (dados: Partial<OrdemManutencaoPatrimonio>) => {
    try {
      const response = await api.post('/patrimonio/manutencao', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar ordem de manutenção');
    }
  }, []);

  const atualizarOrdem = useCallback(async (dados: Partial<OrdemManutencaoPatrimonio>) => {
    if (!id) throw new Error('ID da ordem não informado');
    try {
      const response = await api.put(`/patrimonio/manutencao/${id}`, dados);
      setOrdem(response.data);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atualizar ordem de manutenção');
    }
  }, [id]);

  const concluirOrdem = useCallback(async (dados: any) => {
    if (!id) throw new Error('ID da ordem não informado');
    try {
      const response = await api.post(`/patrimonio/manutencao/${id}/concluir`, dados);
      setOrdem(response.data.ordem);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao concluir ordem de manutenção');
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchOrdem();
  }, [id, fetchOrdem]);

  return { ordem, isLoading, error, refetch: fetchOrdem, criarOrdem, atualizarOrdem, concluirOrdem };
}