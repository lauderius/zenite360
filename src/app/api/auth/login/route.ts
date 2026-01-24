import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'zenite360-secret-key-change-in-production'
);

// Mock data para desenvolvimento
const MOCK_USERS = {
  admin: {
    id: 1,
    email: 'admin@zenite360.ao',
    name: 'Administrador',
    password: '$2b$10$8K8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8VzJ8Vz', // senha: Admin@Z360!
    funcionarioId: 1,
    activo: true,
    bloqueado: false,
    nivelAcesso: 'SUPER_ADMIN',
  },
};

const MOCK_FUNCIONARIOS = {
  1: {
    id: 1,
    numeroMecanografico: 'ADM001',
    nomeCompleto: 'Administrador do Sistema',
    dataNascimento: new Date('1980-01-01'),
    genero: 'MASCULINO' as const,
    nacionalidade: 'Angolana',
    tipoDocumento: 'BI' as const,
    numeroDocumento: '123456789LA001',
    telefone1: '+244 923 123 456',
    emailInstitucional: 'admin@zenite360.ao',
    departamentoId: 1,
    cargo: 'Administrador',
    nivelAcesso: 'SUPER_ADMIN' as const,
    status: 'ACTIVO' as const,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Buscar usuário mock
    const usuario = MOCK_USERS[username as keyof typeof MOCK_USERS];

    if (!usuario) {
      return NextResponse.json(
        { error: 'Utilizador não encontrado' },
        { status: 401 }
      );
    }

    // Verificar password
    const passwordValid = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = await new SignJWT({
      userId: usuario.id,
      email: usuario.email,
      nivelAcesso: usuario.nivelAcesso,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        funcionarioId: usuario.funcionarioId,
        nivelAcesso: usuario.nivelAcesso,
      }
    });

  } catch (error: any) {
    console.error('ERRO NO SERVIDOR:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno no servidor', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}
