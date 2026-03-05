import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing seed data to allow re-runs
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const author = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@aliceblog.dev",
      role: "ADMIN",
    },
  });

  const post = await prisma.post.create({
    data: {
      slug: "hello-world",
      title: "Hello, World — O primeiro post do Alice Blog",
      excerpt:
        "Uma introdução ao Alice Blog: um espaço para compartilhar conhecimento sobre desenvolvimento moderno com Next.js, React e TypeScript.",
      content: `# Hello, World

Bem-vindo ao **Alice Blog**!

Este é o primeiro post — um espaço criado para explorar desenvolvimento moderno com foco em performance, tipagem estrita e experiência do desenvolvedor.

## O que vem por aí

- Artigos sobre Next.js 16 e App Router
- Padrões de arquitetura Server-First
- React 19 na prática: \`useOptimistic\`, \`useActionState\`
- Tailwind CSS v4 e design systems

Fique à vontade para comentar e dar seu like. 👋`,
      status: "PUBLISHED",
      publishedAt: new Date(),
      tags: ["meta", "introdução", "next.js"],
      readingTime: 2,
      authorId: author.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "Que post incrível! Mal posso esperar pelos próximos conteúdos.",
      authorName: "Leitor Exemplo",
      authorEmail: "leitor@exemplo.com",
      postId: post.id,
    },
  });

  console.log("✅ Seed concluído:");
  console.log(`   User  → ${author.name} (${author.email})`);
  console.log(`   Post  → /blog/${post.slug}`);
  console.log("   Comment → 1 comentário de exemplo");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
