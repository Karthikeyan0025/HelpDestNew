"use client";

import { useState, useRef, useEffect } from "react";

function getEmbedUrl(url) {
  try {
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract video ID
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Return original URL for other video platforms
    return url;
  } catch (error) {
    console.error('Error processing video URL:', error);
    return url;
  }
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! How may I help you?", videos: [] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.message,
          videos: data.videos || [] 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[80vw] max-w-4xl">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={getEmbedUrl(selectedVideo)}
              className="w-full aspect-video"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">AI Support Assistant</h3>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-100"
            } rounded-lg p-3 max-w-[80%]`}
          >
            {message.content}
            {message.videos && message.videos.length > 0 && (
              <div className="mt-2">
                {message.videos.map((video, vIndex) => (
                  <button 
                    key={vIndex}
                    onClick={() => setSelectedVideo(video)}
                    className="text-blue-600 hover:underline block cursor-pointer"
                  >
                    📺 Watch helpful video
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto bg-gray-100 rounded-lg p-3">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium text-sm transition-colors duration-200 shadow-sm flex items-center justify-center min-w-[90px]"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 