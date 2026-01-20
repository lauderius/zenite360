// prisma.config.ts
import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    // Aqui é onde o Prisma 7 espera a URL
    url: process.env.DATABASE_URL,
  },
})