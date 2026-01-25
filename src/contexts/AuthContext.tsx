'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Usuario, Funcionario, LoginCredentials, AuthContextType, NivelAcesso } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'zenite360_token';
const REFRESH_TOKEN_KEY = 'zenite360_refresh_token';
const USER_KEY = 'zenite360_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUsuario(userData.usuario);
          setFuncionario(userData.funcionario);
          
          // Validar token com o backend
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:loadStoredAuth',message:'loadStoredAuth - token/storedUser encontrados',data:{tokenExists:!!token,storedUserExists:!!storedUser},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
          // #endregion
          await validateToken(token);
        }
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Validar token com API
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:validateToken:before',message:'validateToken - iniciando request',data:{endpoint:'/api/auth/validate'},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      const response = await fetch('/api/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:validateToken:response',message:'validateToken - response not ok',data:{status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        clearAuth();
        return false;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:validateToken:responseOk',message:'validateToken - token válido',data:{status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      return true;
    } catch {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:validateToken:error',message:'validateToken - exception',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      return false;
    }
  };

  // Limpar dados de autenticação
  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
    setFuncionario(null);
  };

  // Função de login
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Ler corpo de resposta com fallback
      let data: any = null;
      let bodyText = '';
      try {
        bodyText = await response.text();
        try {
          data = bodyText ? JSON.parse(bodyText) : null;
        } catch {
          data = null;
        }
      } catch {
        bodyText = '';
        data = null;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:login:response',message:'login - response recebido',data:{status:response.status,bodyPresent:!!bodyText,bodySampleLength: bodyText ? Math.min(200, bodyText.length) : 0},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:login:failed',message:'login - response not ok',data:{status:response.status,bodyTextSample: bodyText ? bodyText.slice(0,200) : null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
        setIsLoading(false);
        return false;
      }

      // Armazenar tokens
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify({
        usuario: data.usuario,
        funcionario: data.funcionario,
      }));

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:login:stored',message:'login - tokens armazenados',data:{usuarioId:data.usuario?.id,funcionarioId:data.funcionario?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      setUsuario(data.usuario);
      setFuncionario(data.funcionario);

      router.push('/dashboard');
      return true;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d2d8f97-0a76-44ba-ac80-8cc7d10af208',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/contexts/AuthContext.tsx:login:error',message:'login - exception',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Função de logout
  const logout = useCallback(() => {
    clearAuth();
    router.push('/login');
  }, [router]);

  // Verificar permissão do utilizador
  const checkPermission = useCallback((nivel: NivelAcesso | NivelAcesso[]): boolean => {
    if (!funcionario) return false;

    const niveisPermitidos = Array.isArray(nivel) ? nivel : [nivel];
    
    // Super admin tem acesso a tudo
    if (funcionario.nivelAcesso === 'SUPER_ADMIN') return true;

    return niveisPermitidos.includes(funcionario.nivelAcesso);
  }, [funcionario]);

  const value: AuthContextType = {
    usuario,
    funcionario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    checkPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

// Hook para proteger rotas
export function useRequireAuth(allowedRoles?: NivelAcesso[]) {
  const { isAuthenticated, isLoading, funcionario, checkPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && !checkPermission(allowedRoles)) {
        router.push('/dashboard?error=sem_permissao');
      }
    }
  }, [isAuthenticated, isLoading, allowedRoles, router, checkPermission]);

  return { isLoading, isAuthenticated, funcionario };
}