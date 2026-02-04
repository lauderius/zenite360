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
      const response = await fetch('/api/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        clearAuth();
        return false;
      }
      return true;
    } catch {
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

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      // Armazenar tokens
      localStorage.setItem(TOKEN_KEY, data.token);
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }

      const authData = {
        usuario: data.usuario,
        funcionario: data.funcionario || {
          id: data.usuario?.id,
          nomeCompleto: data.usuario?.name || data.usuario?.username,
          nivelAcesso: 'ADMINISTRATIVO',
          status: 'ACTIVO'
        },
      };

      localStorage.setItem(USER_KEY, JSON.stringify(authData));

      setUsuario(authData.usuario);
      setFuncionario(authData.funcionario);

      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
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