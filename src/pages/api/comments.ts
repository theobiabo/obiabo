import type { APIRoute } from 'astro';
import { db, comments } from 'astro:db';
import { sendTelegramNotification } from '../../utils/telegram';


function getSessionId(request: Request): string {
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/sessionId=([^;]+)/);
  
  if (sessionMatch) {
    return sessionMatch[1];
  }
  
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}


function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function sanitizeContent(content: string): string {
  return content.trim().replace(/<[^>]*>/g, '');
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export const GET: APIRoute = async ({ url }) => {
  const postId = url.searchParams.get('postId');
  
  if (!postId) {
    return new Response(JSON.stringify({ error: 'Post ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const allComments = await db.select().from(comments);
    const filtered = allComments.filter(c => c.postId === postId);
    
    const approvedComments = filtered
      .filter(c => c.approved)
      .map(c => ({
        _id: c.id,
        name: getFirstName(c.name),
        content: c.content,
        createdAt: c.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify({ comments: approvedComments }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching comments:', errorMessage, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { postId, name, email, content } = body;

    
    if (!postId || !name || !content) {
      return new Response(
        JSON.stringify({ error: 'Post ID, name, and content are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name must be 100 characters or less' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (content.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Comment must be 1000 characters or less' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (email && !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionId = getSessionId(request);
    const sanitizedContent = sanitizeContent(content);
    const sanitizedName = sanitizeContent(name);
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date();

    
    await db.insert(comments).values({
      id: commentId,
      postId,
      name: sanitizedName,
      email: email || undefined,
      content: sanitizedContent,
      approved: true,
      sessionId,
      createdAt,
    });

    
    try {
      await sendTelegramNotification({
        commentId,
        postId,
        name: sanitizedName,
        content: sanitizedContent,
        email: email || undefined,
      });
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const hasSessionCookie = request.headers.get('cookie')?.includes('sessionId=');
    
    if (!hasSessionCookie) {
      headers.set(
        'Set-Cookie',
        `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
      );
    }

    const publishedComment = {
      _id: commentId,
      name: getFirstName(sanitizedName),
      content: sanitizedContent,
      createdAt: createdAt.toISOString(),
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Comment published',
        commentId,
        comment: publishedComment,
      }),
      {
        status: 201,
        headers,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating comment:', errorMessage, error);
    return new Response(
      JSON.stringify({ error: 'Failed to create comment', details: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
