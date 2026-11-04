import type { APIRoute } from "astro";
import { db, eq, comments } from "astro:db";

const ADMIN_SECRET = import.meta.env.ADMIN_SECRET;

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!ADMIN_SECRET || !authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  return token === ADMIN_SECRET;
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const allComments = await db.select().from(comments);

    const sorted = allComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return new Response(JSON.stringify({ comments: sorted }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch comments",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { commentId, approved } = body;

    if (!commentId || typeof approved !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Comment ID and approved status required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await db
      .update(comments)
      .set({ approved })
      .where(eq(comments.id, commentId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to update comment",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { commentId } = body;

    if (!commentId) {
      return new Response(JSON.stringify({ error: "Comment ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete comment",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
