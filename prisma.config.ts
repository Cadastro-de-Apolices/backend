import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic", // ou "binary" se quiser o motor nativo
  datasource: {
    url: env("DATABASE_URL"), // carrega do .env
  },
});
