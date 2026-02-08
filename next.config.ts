import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // Gera a pasta 'out' necessária para o Capacitor
  images: {
    unoptimized: true,   // Obrigatório para apps mobile/estáticos
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Se estiver a usar o Next.js 15, o turbopack é configurado aqui se necessário
};

export default nextConfig;