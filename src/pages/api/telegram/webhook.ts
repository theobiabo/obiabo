import type { APIRoute } from 'astro';
import { db, eq, comments } from 'astro:db';
import { Telegraf } from 'telegraf';
import { escapeMarkdown } from '../../../utils/telegram';

type CommentAction = 'approve' | 'reject' | 'delete';

function getEnv(key: string): string | undefined {
  
  if (import.meta.env.PROD) {
    return process.env[key];
  }
  return import.meta.env[key] as string | undefined;
}

function isAllowedChat(chatId: number | string | undefined): boolean {
  const configuredChatId = getEnv('TELEGRAM_CHAT_ID');

  if (!configuredChatId || chatId === undefined) {
    return false;
  }

  return String(chatId) === configuredChatId;
}

async function runCommentAction(action: CommentAction, commentId: string): Promise<string> {
  switch (action) {
    case 'approve':
      console.log('[Telegram Webhook] Approving comment:', commentId);
      await db.update(comments)
        .set({ approved: true })
        .where(eq(comments.id, commentId));
      return 'Comment approved';

    case 'reject':
      console.log('[Telegram Webhook] Moving comment to pending:', commentId);
      await db.update(comments)
        .set({ approved: false })
        .where(eq(comments.id, commentId));
      return 'Comment moved to pending';

    case 'delete':
      console.log('[Telegram Webhook] Deleting comment:', commentId);
      await db.delete(comments).where(eq(comments.id, commentId));
      return 'Comment deleted';
  }
}

export const POST: APIRoute = async ({ request }) => {
  const botToken = getEnv('TELEGRAM_BOT_TOKEN');
  
  console.log('[Telegram Webhook] POST received');
  console.log('[Telegram Webhook] Bot token exists:', !!botToken);
  
  if (!botToken) {
    console.error('[Telegram Webhook] Bot token not configured');
    return new Response(JSON.stringify({ error: 'Bot not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const update = await request.json();
    console.log('[Telegram Webhook] Update received:', JSON.stringify(update, null, 2));
    
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message?.chat?.id;
      const messageId = callbackQuery.message?.message_id;
      const bot = new Telegraf(botToken);
      
      if (!data || !chatId || !messageId) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!isAllowedChat(chatId)) {
        await bot.telegram.answerCbQuery(callbackQuery.id, 'Unauthorized chat');
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const [action, commentId] = data.split(':') as [CommentAction, string | undefined];

      if (!['approve', 'reject', 'delete'].includes(action) || !commentId) {
        await bot.telegram.answerCbQuery(callbackQuery.id, 'Unknown action');
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      try {
        const responseText = await runCommentAction(action, commentId);
        await bot.telegram.answerCbQuery(callbackQuery.id, responseText);

        const originalText = callbackQuery.message?.text || '';
        const updatedText = originalText.replace(
          /(⏳ _Awaiting approval_|✅ _Published automatically_)/,
          `✅ _${escapeMarkdown(responseText)}_`
        );
        
        await bot.telegram.editMessageText(
          chatId,
          messageId,
          undefined,
          updatedText,
          { parse_mode: 'MarkdownV2' }
        );

        
        await bot.telegram.editMessageReplyMarkup(chatId, messageId, undefined, {
          inline_keyboard: [],
        });

      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        await bot.telegram.answerCbQuery(callbackQuery.id, 'Operation failed');
      }
    }

    if (update.message?.text) {
      const chatId = update.message.chat?.id;
      const messageText = String(update.message.text).trim();
      const bot = new Telegraf(botToken);

      if (!isAllowedChat(chatId)) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const match = messageText.match(/^\/(approve|reject|delete)(?:@\w+)?\s+(\S+)/i);

      if (match) {
        const action = match[1].toLowerCase() as CommentAction;
        const commentId = match[2];

        try {
          const responseText = await runCommentAction(action, commentId);
          await bot.telegram.sendMessage(
            chatId,
            `✅ ${escapeMarkdown(responseText)}\n\nID: \`${escapeMarkdown(commentId)}\``,
            { parse_mode: 'MarkdownV2' }
          );
        } catch (dbError) {
          console.error('Database operation failed:', dbError);
          await bot.telegram.sendMessage(chatId, 'Operation failed');
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


export const GET: APIRoute = async ({ request }) => {
  const botToken = getEnv('TELEGRAM_BOT_TOKEN');
  const chatId = getEnv('TELEGRAM_CHAT_ID');
  const url = new URL(request.url);
  const setupKey = url.searchParams.get('setup');
  const statusKey = url.searchParams.get('status');
  const adminSecret = getEnv('ADMIN_SECRET') || 'admin123';

  
  if (url.searchParams.get('health') === 'check') {
    const isConfigured = !!botToken && !!chatId;
    
    return new Response(JSON.stringify({ 
      status: isConfigured ? 'ready' : 'not_configured',
      timestamp: new Date().toISOString(),
      environment: import.meta.env.PROD ? 'production' : 'development',
      bot: {
        tokenConfigured: !!botToken,
        chatIdConfigured: !!chatId,
      }
    }), {
      status: isConfigured ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  
  if (statusKey === adminSecret) {
    if (!botToken) {
      return new Response(JSON.stringify({ 
        error: 'Bot token not configured',
        hasToken: false,
        hasChatId: !!chatId
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const bot = new Telegraf(botToken);
      const webhookInfo = await bot.telegram.getWebhookInfo();
      
      return new Response(JSON.stringify({ 
        success: true,
        hasToken: true,
        hasChatId: !!chatId,
        webhookInfo
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response(JSON.stringify({ 
        error: 'Failed to get webhook info', 
        details: errorMessage 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  
  if (setupKey !== adminSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!botToken) {
    return new Response(JSON.stringify({ error: 'Bot token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const bot = new Telegraf(botToken);
    const webhookUrl = `${url.origin}/api/telegram/webhook`;
    
    await bot.telegram.setWebhook(webhookUrl);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook set successfully',
      webhookUrl 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: 'Failed to set webhook', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
