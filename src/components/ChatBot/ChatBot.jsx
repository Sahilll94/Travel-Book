import React, { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Suggested queries for easy clicking
  const suggestedQueries = [
    "What is Travel Book?",
    "How do I create a travel story?",
    "How do I login?",
    "How can I contribute?"
  ];

  // Show initial greeting message
  useEffect(() => {
    if (!hasInteracted && isOpen) {
      setMessages([
        {
          id: 1,
          text: "What's up Traveller! 👋 Ready to share your adventures?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setHasInteracted(true);
    }
  }, [isOpen, hasInteracted]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (message = inputValue) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend chatbot API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}chat`,
        {
          message: message,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }
      );

      // Add bot response to chat
      console.log('Backend response:', response.data); // Debug log
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message || response.data.response || 'No response received',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error details:', error.response?.data);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Chatbot Floating Button */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="relative"
            aria-label="Open chatbot"
          >
            {/* Simple circular button */}
            <div className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 transform">
              <FiMessageCircle className="w-7 h-7 text-white" />
            </div>

            {/* Welcome message bubble - shows when closed */}
            {!isOpen && (
              <div className="absolute bottom-20 left-0 max-w-xs mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Compact Welcome Bubble */}
                <div className="bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-lg px-3 py-2 text-xs">
                  <p className="font-semibold">What's up Traveller? 👋</p>
                  <p className="text-gray-200 text-xs mt-0.5">Got questions?</p>
                </div>
              </div>
            )}
          </button>
        ) : null}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
          <div className="fixed inset-0 md:inset-auto md:bottom-6 md:left-6 w-full md:w-96 h-full md:h-[min(800px,90vh)] bg-white dark:bg-gray-900 rounded-none md:rounded-2xl shadow-lg flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300 border-0 md:border border-gray-200 dark:border-gray-700">
            {/* Header - Minimalist */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Travel Bot</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessages([]);
                  setHasInteracted(false);
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close chatbot"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-800 custom-scrollbar"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Ask me anything about Travel Book
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm px-3 py-2 rounded-lg text-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      {msg.sender === 'bot' ? (
                        <div className="text-sm leading-relaxed markdown-content">
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-1 mb-1" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-1" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5" {...props} />,
                              li: ({ node, ...props }) => <li className="text-xs" {...props} />,
                              code: ({ node, inline, ...props }) => 
                                inline ? (
                                  <code className="bg-gray-300 dark:bg-gray-600 px-1 rounded text-xs" {...props} />
                                ) : (
                                  <code className="block bg-gray-300 dark:bg-gray-600 p-1 rounded text-xs overflow-x-auto" {...props} />
                                ),
                              a: ({ node, ...props }) => <a className="text-blue-600 dark:text-blue-400 underline hover:no-underline" {...props} />,
                              blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-gray-400 pl-2 italic text-xs" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                              em: ({ node, ...props }) => <em className="italic" {...props} />,
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Suggested queries - shown when no messages yet */}
              {messages.length <= 1 && messages[0]?.sender === 'bot' && (
                <div className="mt-2 space-y-1">
                  {suggestedQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuery(query)}
                      className="w-full text-left text-xs px-2 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded border border-gray-300 dark:border-gray-600 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      • {query}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Minimalist */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      sendMessage();
                    }
                  }}
                  placeholder="Type here..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default ChatBot;
