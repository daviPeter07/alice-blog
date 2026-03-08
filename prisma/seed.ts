import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const BCRYPT_ROUNDS = 10;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(
      `Variável de ambiente ${name} é obrigatória para o seed. Defina em .env (veja .env.example).`
    );
  }
  return value.trim();
}

async function main() {
  console.log("🌱 Seeding database...");

  const aliceName = requireEnv("SEED_ALICE_NAME");
  const aliceEmail = requireEnv("SEED_ALICE_EMAIL");
  const alicePassword = requireEnv("SEED_ALICE_PASSWORD");
  const daviName = requireEnv("SEED_DAVI_NAME");
  const daviEmail = requireEnv("SEED_DAVI_EMAIL");
  const daviPassword = requireEnv("SEED_DAVI_PASSWORD");

  const alicePasswordHash = await bcrypt.hash(alicePassword, BCRYPT_ROUNDS);
  const daviPasswordHash = await bcrypt.hash(daviPassword, BCRYPT_ROUNDS);

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: aliceName,
      email: aliceEmail,
      passwordHash: alicePasswordHash,
      role: "ADMIN",
    },
  });

  const davi = await prisma.user.create({
    data: {
      name: daviName,
      email: daviEmail,
      passwordHash: daviPasswordHash,
      role: "ADMIN",
    },
  });

  // Post 1 — Filosofia
  const post1 = await prisma.post.create({
    data: {
      slug: "o-peso-da-liberdade",
      title: "O Peso da Liberdade",
      excerpt:
        "Sartre disse que estamos condenados a ser livres. Mas o que acontece quando a liberdade se torna fardo — quando a ausência de trilhos nos paralisa em vez de nos libertar?",
      content: `Existe um paradoxo silencioso na modernidade: nunca tivemos tantas escolhas, e nunca nos sentimos tão perdidos.

Sartre, em seu existencialismo radical, afirmava que a liberdade não é um privilégio — é uma condenação. Não há natureza humana prévia, nenhum roteiro imposto pelo céu ou pela biologia. Somos, a cada instante, o resultado daquilo que escolhemos fazer com o que nos fizeram.

Isso soa libertador. E durante um tempo, foi.

Mas Erich Fromm, décadas depois, observou algo que Sartre talvez não tenha previsto com clareza suficiente: a liberdade assusta. Em "O Medo à Liberdade", ele argumenta que o ser humano, ao se ver desatado das velhas hierarquias — da Igreja, do feudo, da tradição —, não sentiu apenas alívio. Sentiu vertigem.

E vertigem leva a dois caminhos: o salto criativo, ou a fuga para novas formas de servidão voluntária.

Olhamos ao redor e reconhecemos os dois.

De um lado, pessoas que constroem sentido com as próprias mãos — na arte, na filosofia, nos vínculos reais, no engajamento político genuíno. Do outro, massas que entregam sua liberdade a algoritmos, a líderes carismáticos, a identidades de grupo que pensam por elas.

A questão não é se somos livres. Somos — talvez mais do que suportamos.

A questão é o que fazemos com esse peso.`,
      status: "PUBLISHED",
      publishedAt: new Date("2025-11-10"),
      tags: ["filosofia", "existencialismo", "liberdade"],
      readingTime: 5,
      authorId: alice.id,
    },
  });

  // Post 2 — Crítica social
  const post2 = await prisma.post.create({
    data: {
      slug: "solidao-em-rede",
      title: "Solidão em Rede",
      excerpt:
        "Estamos mais conectados do que qualquer geração anterior — e mais sós. Como chegamos aqui, e o que essa contradição diz sobre o tipo de presença que as redes sociais nos ensinam a simular.",
      content: `Em 1990, Robert Putnam começou a documentar um fenômeno que chamaria de "declínio do capital social" nos Estados Unidos. As pessoas estavam jogando boliche sozinhas — literalmente. Clubes esvaziavam. Associações de bairro morriam. A vida cívica se fragmentava.

Ele não poderia imaginar o que viria a seguir.

Três décadas depois, temos plataformas com bilhões de usuários, feeds infinitos de rostos conhecidos, notificações que imitam o chamado de um amigo. E ainda assim — os índices de solidão dispararam. A geração Z, a primeira a crescer com smartphone na mão desde a adolescência, é a mais conectada e a mais solitária da história registrada.

Isso não é coincidência. É arquitetura.

As redes sociais não foram projetadas para aproximar pessoas — foram projetadas para maximizar engajamento. E engajamento, descobriu-se, não vem da satisfação. Vem da ansiedade, da comparação, do ciclo incessante de validação e frustração.

O que se perdeu, no processo, foi a qualidade da presença.

Presença real exige vulnerabilidade, tempo, fricção. Exige suportar o silêncio ao lado de alguém. Exige dizer coisas que não foram editadas. As redes nos ensinaram a substituir isso por uma versão curada de nós mesmos — sempre disponível, sempre interessante, nunca realmente lá.

O sociólogo Sherry Turkle tem uma frase que não me sai da cabeça: "Estamos juntos, mas cada um em seu próprio casulo."

A pergunta não é se as redes são boas ou más. É: que tipo de presença estamos dispostos a oferecer uns aos outros?`,
      status: "PUBLISHED",
      publishedAt: new Date("2025-12-03"),
      tags: ["crítica social", "tecnologia", "solidão"],
      readingTime: 6,
      authorId: alice.id,
    },
  });

  // Post 3 — História
  const post3 = await prisma.post.create({
    data: {
      slug: "o-que-lembramos-quando-esquecemos",
      title: "O Que Lembramos Quando Esquecemos",
      excerpt:
        "A memória histórica não é um arquivo neutro — é um campo de batalha. Quem controla o passado controla o presente, e entender como as sociedades escolhem o que esquecer é entender como exercem poder sobre si mesmas.",
      content: `Há uma cena que me persegue desde que li pela primeira vez sobre o desmonte das estátuas confederadas nos Estados Unidos: a de grupos que choravam diante de monumentos de bronze, dizendo que sua história estava sendo apagada.

Não era a história que estava sendo apagada. Era uma versão dela — cuidadosamente construída décadas depois da Guerra Civil para romantizar a Confederação, silenciar a escravidão e reafirmar a supremacia branca sob nova roupagem.

O historiador David Blight chama isso de "reconciliação sem justiça": o processo pelo qual uma sociedade decide seguir em frente enterrando as perguntas difíceis, preferindo a coesão superficial à verdade incômoda.

Não é um fenômeno americano.

No Brasil, a Proclamação da República ainda é ensinada como avanço inevitável. O período colonial aparece como "descobrimento". A ditadura militar ocupa, em muitos livros didáticos, menos páginas do que a Era Vargas. A memória oficial é sempre uma negociação — entre o que o presente precisa acreditar de si mesmo e o que o passado insiste em mostrar.

O filósofo Paul Ricoeur argumentou que memória e esquecimento não são opostos — são parceiros. Toda lembrança é também uma seleção. Toda narrativa histórica inclui e exclui. A questão não é se vamos esquecer, mas quem decide o que fica de fora.

E, mais urgente ainda: quem paga o preço desse esquecimento.

As sociedades que não conseguem olhar para seus passados violentos tendem a repeti-los — não por fatalidade, mas por falta de prática em reconhecer os padrões. A memória histórica não é nostalgia. É uma forma de ver o presente com mais clareza.`,
      status: "PUBLISHED",
      publishedAt: new Date("2026-01-18"),
      tags: ["história", "memória", "poder"],
      readingTime: 7,
      authorId: alice.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "Esse trecho do Fromm sobre a fuga da liberdade me tocou profundamente. É exatamente o que vejo acontecer ao meu redor — pessoas trocando autonomia por pertencimento a tribos que pensam por elas.",
      authorName: "Mariana F.",
      authorEmail: "mariana@exemplo.com",
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: 'A frase da Sherry Turkle resume tudo. Já tentei explicar isso para pessoas mais velhas e elas não entendem — acham que "estar conectado" e "estar junto" são a mesma coisa.',
      authorName: "Rafael C.",
      authorEmail: "rafael@exemplo.com",
      postId: post2.id,
    },
  });

  console.log("✅ Seed concluído:");
  console.log(`   Alice (ADMIN) → ${alice.name} (${alice.email})`);
  console.log(`   Davi (DEV) → ${davi.name} (${davi.email})`);
  console.log(`   Posts → ${post1.slug} | ${post2.slug} | ${post3.slug}`);
  console.log("   Comments → 2 comentários de exemplo");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
