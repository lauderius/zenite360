'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Alert, Spinner } from '@/components/ui';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-sky-600 rounded-lg mb-4">
            <Icons.Building size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Zênite360</h1>
          <p className="text-slate-600 mt-2">Sistema de Gestão Hospitalar</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Aceder ao Sistema</h2>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome de Utilizador ou Email"
              name="username"
              type="text"
              placeholder="seu_utilizador"
              value={formData.username}
              onChange={handleChange}
              required
              icon={<Icons.User size={18} />}
            />

            <Input
              label="Palavra-passe"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<Icons.Menu size={18} />}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  A conectar...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Rodapé */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>© {new Date().getFullYear()} Zênite360 — Angola 🇦🇴</p>
          </div>
        </div>
      </div>
    </div>
  );
}