import type { Metadata } from "next";
import { getRecentPosts } from "@/data-access/posts";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
  title:       "Artigos",
  description: "Ensaios sobre filosofia, história, crítica social e a condição humana.",
};

export default async function BlogPage() {
  const posts = await getRecentPosts(20);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Cabeçalho da listagem */}
      <header className="mb-14">
        <p
          className="animate-fade-up font-ui text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 select-none"
          style={{ animationDelay: "0ms" }}
        >
          por Alice
        </p>
        <h1
          className="animate-fade-up font-body text-5xl font-semibold text-foreground mb-4 leading-tight"
          style={{ animationDelay: "60ms" }}
        >
          Artigos
        </h1>
        <p
          className="animate-fade-up font-ui text-muted-foreground text-lg leading-relaxed max-w-sm"
          style={{ animationDelay: "120ms" }}
        >
          Ensaios sobre filosofia, história, crítica social e a condição humana.
        </p>
      </header>

      {/* Lista de posts */}
      {posts.length === 0 ? (
        <p className="font-ui text-muted-foreground">
          Nenhum artigo publicado ainda.
        </p>
      ) : (
        <section className="flex flex-col gap-4" aria-label="Lista de artigos">
          {posts.map((post, index) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt ?? ""}
              publishedAt={post.publishedAt}
              tags={post.tags}
              readingTime={post.readingTime}
              author={post.author}
              likesCount={post._count.likes}
              commentsCount={post._count.comments}
              index={index}
            />
          ))}
        </section>
      )}
    </main>
  );
}
