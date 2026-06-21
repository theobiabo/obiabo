import { useState, useEffect } from 'react';

interface Comment {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface BlogCommentsProps {
  postId: string;
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, {
        cache: 'no-store',
      });
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ...formData }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.comment) {
          setComments((currentComments) => [data.comment, ...currentComments]);
        }

        setMessage({
          type: 'success',
          text: 'Comment posted.'
        });
        setFormData({ name: '', email: '', content: '' });
        setShowForm(false);
        fetchComments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit comment' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit comment. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getFirstName = (name: string) => name.trim().split(/\s+/)[0] || name;

  return (
    <div className="mt-12 border-t border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-100">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
          >
            Leave a comment
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500 text-green-400'
              : 'bg-red-500/10 border border-red-500 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-700 rounded-lg ">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-100">Leave a comment</h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-300"
              aria-label="Close form"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-300">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                required
                maxLength={1000}
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
                placeholder="Share your thoughts..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 italic">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-6 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors "
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold bg-transparent text-lg text-gray-100">
                  {getFirstName(comment.name)}
                </h4>
                <time className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
