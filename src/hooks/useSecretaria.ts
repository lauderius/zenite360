import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { DocumentoOficial, SuprimentoEscritorio, RequisicaoMaterial, DashboardSecretaria } from '@/types/administrativo';

export function useDocumentos(filters?: {
  tipo?: string;
  status?: string;
  prioridade?: string;
  search?: string;
}) {
  const [documentos, setDocumentos] = useState<DocumentoOficial[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentos = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (filters?.tipo) params.append('tipo', filters.tipo);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.prioridade) params.append('prioridade', filters.prioridade);
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get(`/secretaria/documentos?${params.toString()}`);
      setDocumentos(response.data.data);
      setPagination(response.data.pagination);
      setStats(response.data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const criarDocumento = useCallback(async (dados: Partial<DocumentoOficial>) => {
    try {
      const response = await api.post('/secretaria/documentos', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar documento');
    }
  }, []);

  const tramitarDocumento = useCallback(async (documentoId: number, dados: any) => {
    try {
      const response = await api.post(`/secretaria/documentos/${documentoId}/tramitar`, dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao tramitar documento');
    }
  }, []);

  const assinarDocumento = useCallback(async (documentoId: number, dados: any) => {
    try {
      const response = await api.post(`/secretaria/documentos/${documentoId}/assinar`, dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao assinar documento');
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  return {
    documentos,
    pagination,
    stats,
    isLoading,
    error,
    refetch: fetchDocumentos,
    criarDocumento,
    tramitarDocumento,
    assinarDocumento,
  };
}

export function useSuprimentos(filters?: { categoria?: string; apenasBaixo?: boolean }) {
  const [suprimentos, setSuprimentos] = useState<SuprimentoEscritorio[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuprimentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.apenasBaixo) params.append('apenasBaixo', 'true');

      const response = await api.get(`/secretaria/suprimentos?${params.toString()}`);
      setSuprimentos(response.data.data);
      setStats(response.data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar suprimentos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSuprimentos();
  }, [fetchSuprimentos]);

  return { suprimentos, stats, isLoading, error, refetch: fetchSuprimentos };
}

export function useRequisicoes(filters?: { status?: string; departamentoId?: number }) {
  const [requisicoes, setRequisicoes] = useState<RequisicaoMaterial[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequisicoes = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      if (filters?.status) params.append('status', filters.status);
      if (filters?.departamentoId) params.append('departamentoId', String(filters.departamentoId));

      const response = await api.get(`/secretaria/requisicoes?${params.toString()}`);
      setRequisicoes(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar requisições');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const criarRequisicao = useCallback(async (dados: any) => {
    try {
      const response = await api.post('/secretaria/requisicoes', dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar requisição');
    }
  }, []);

  const atenderRequisicao = useCallback(async (requisicaoId: number, dados: any) => {
    try {
      const response = await api.post(`/secretaria/requisicoes/${requisicaoId}/atender`, dados);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atender requisição');
    }
  }, []);

  useEffect(() => {
    fetchRequisicoes();
  }, [fetchRequisicoes]);

  return { requisicoes, pagination, isLoading, error, refetch: fetchRequisicoes, criarRequisicao, atenderRequisicao };
}