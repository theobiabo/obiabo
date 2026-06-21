import { useEffect, useState } from 'react';

interface ViewCounterProps {
  postId: string;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    
    const recordView = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });
        const data = await response.json();
        if (data.views !== undefined) {
          setViews(data.views);
        }
      } catch (error) {
        console.error('Failed to record view:', error);
        
        try {
          const response = await fetch(`/api/views?postId=${encodeURIComponent(postId)}`);
          const data = await response.json();
          if (data.views !== undefined) {
            setViews(data.views);
          }
        } catch {
          
        }
      }
    };

    recordView();
  }, [postId]);

  if (views === null) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span>{views} {views === 1 ? 'view' : 'views'}</span>
    </span>
  );
}
