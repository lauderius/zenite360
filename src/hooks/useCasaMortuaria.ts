import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { RegistroObito, CamaraFria, DashboardCasaMortuaria } from '@/types/administrativo';

export function useCasaMortuariaDashboard() {
  const [dashboard, setDashboard] = useState<DashboardCasaMortuaria | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const [estatisticas, camaras] = await Promise.all([
        api.get('/casa-mortuaria/estatisticas?periodo=mes'),
        api.get('/casa-mortuaria/camaras'),
      ]);

      setDashboard({
        corposEmConservacao: camaras.data.resumo.ocupacaoTotal,
        capacidadeTotalCamaras: camaras.data.resumo.capacidadeTotal,
        ocupacaoPercentual: parseFloat(
          ((camaras.data.resumo.ocupacaoTotal / camaras.data.resumo.capacidadeTotal) * 100).toFixed(1)
        ),
        obitosHoje: estatisticas.data.resumo.totalObitos,
        obitosMes: estatisticas.data.resumo.totalObitos,
        tempoMedioConservacao: parseFloat(estatisticas.data.resumo.tempoMedioConservacao),
        aguardandoDocumentacao: 0, // Será calculado no componente
        liberadosHoje: 0,
        camarasComAlerta: camaras.data.data.filter((c: CamaraFria) => c.status !== 'OPERACIONAL'),
        distribuicaoPorCausa: estatisticas.data.distribuicao.porCausa,
        distribuicaoPorGenero: estatisticas.data.distribuicao.porGenero,
      });
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

export function useRegistrosObito(filters?: {
  status?: string;
  causaObito?: string;
  camaraFria?: string;
}) {
  const [registros, setRegistros] = useState<RegistroObito[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistros = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (filters?.status) params.append('status', filters.status);
      if (filters?.causaObito) params.append('causaObito', filters.causaObito);
      if (filters?.camaraFria) params.append('camaraFria', filters.camaraFria);

      const response = await api.get(`/casa-mortuaria/registros?${params.toString()}`);
      setRegistros(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar registros');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const criarRegistro = useCallback(async (dados: Partial<RegistroObito>) => {
    try {
      const response = await api.post('/casa-mortuaria/registros', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar registro de óbito');
    }
  }, []);

  const emitirGuiaSaida = useCallback(async (registroId: number, dados: any) => {
    try {
      const response = await api.post(`/casa-mortuaria/registros/${registroId}/guia-saida`, dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao emitir guia de saída');
    }
  }, []);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  return { registros, pagination, isLoading, error, refetch: fetchRegistros, criarRegistro, emitirGuiaSaida };
}

export function useCamarasFrias() {
  const [camaras, setCamaras] = useState<CamaraFria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCamaras = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/casa-mortuaria/camaras');
      setCamaras(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar câmaras frias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCamaras();
    // Polling a cada 60 segundos para atualizar temperaturas
    const interval = setInterval(fetchCamaras, 60000);
    return () => clearInterval(interval);
  }, [fetchCamaras]);

  return { camaras, isLoading, error, refetch: fetchCamaras };
}