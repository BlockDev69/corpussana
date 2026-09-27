import type { APIRoute } from "astro";
import { turso } from "../../turso";

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${import.meta.env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const data = await request.json();
  const { slug, title, author, summary, date, image, color, content } = data;

  if (!slug || !title || !author || !summary || !date || !content) {
    return new Response(JSON.stringify({ error: 'Champs manquants' }), { status: 400 });
  }

  try {
    await turso.execute({
      sql: `INSERT INTO articles (slug, title, author, summary, date, image, color, content)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        slug,
        title,
        author,
        summary,
        date,
        image || null,
        color || 'blue',
        content
      ],
    });

    return new Response(JSON.stringify({ success: true, message: 'Article créé avec succès !' }), { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Erreur de base de données' }), { status: 500 })
  }
};
