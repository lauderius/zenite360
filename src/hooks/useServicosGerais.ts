import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ContratoTerceiro, ColetaResiduo, EstoqueCozinha, DashboardServicosGerais } from '@/types/administrativo';

export function useContratos(filters?: { tipo?: string; status?: string }) {
  const [contratos, setContratos] = useState<ContratoTerceiro[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContratos = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.tipo) params.append('tipo', filters.tipo);
      if (filters?.status) params.append('status', filters.status);

      const response = await api.get(`/servicos-gerais/contratos?${params.toString()}`);
      setContratos(response.data.data);
      setStats(response.data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar contratos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const criarContrato = useCallback(async (dados: Partial<ContratoTerceiro>) => {
    try {
      const response = await api.post('/servicos-gerais/contratos', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar contrato');
    }
  }, []);

  const avaliarContrato = useCallback(async (contratoId: number, avaliacao: any) => {
    try {
      const response = await api.post(`/servicos-gerais/contratos/${contratoId}/avaliar`, avaliacao);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao avaliar contrato');
    }
  }, []);

  useEffect(() => {
    fetchContratos();
  }, [fetchContratos]);

  return { contratos, stats, isLoading, error, refetch: fetchContratos, criarContrato, avaliarContrato };
}

export function useColetasResiduos(filters?: { status?: string; dataInicio?: string; dataFim?: string }) {
  const [coletas, setColetas] = useState<ColetaResiduo[]>([]);
  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColetas = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
      if (filters?.dataFim) params.append('dataFim', filters.dataFim);

      const response = await api.get(`/servicos-gerais/residuos?${params.toString()}`);
      setColetas(response.data.data);
      setEstatisticas(response.data.estatisticas);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar coletas');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const registrarColeta = useCallback(async (dados: any) => {
    try {
      const response = await api.post('/servicos-gerais/residuos', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao registrar coleta');
    }
  }, []);

  useEffect(() => {
    fetchColetas();
  }, [fetchColetas]);

  return { coletas, estatisticas, isLoading, error, refetch: fetchColetas, registrarColeta };
}

export function useEstoqueCozinha(filters?: { categoria?: string; apenasBaixo?: boolean }) {
  const [itens, setItens] = useState<EstoqueCozinha[]>([]);
  const [alertas, setAlertas] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstoque = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.apenasBaixo) params.append('apenasBaixo', 'true');

      const response = await api.get(`/servicos-gerais/cozinha/estoque?${params.toString()}`);
      setItens(response.data.data);
      setAlertas(response.data.alertas);
      setStats(response.data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estoque');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const registrarMovimentacao = useCallback(async (dados: any) => {
    try {
      const response = await api.post('/servicos-gerais/cozinha/estoque', dados);
      await fetchEstoque();
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao registrar movimentação');
    }
  }, [fetchEstoque]);

  useEffect(() => {
    fetchEstoque();
  }, [fetchEstoque]);

  return { itens, alertas, stats, isLoading, error, refetch: fetchEstoque, registrarMovimentacao };
}