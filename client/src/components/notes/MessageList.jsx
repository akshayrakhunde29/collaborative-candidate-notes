import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';

const MessageList = ({ messages, typingUsers }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderMessage = (message, isOwn) => {
    const processedContent = message.content.replace(
      /@(\w+)/g,
      '<span class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-medium">@$1</span>'
    );

    return (
      <div
        key={message._id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} max-w-xs lg:max-w-md`}>
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {message.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className={`mx-2 ${isOwn ? 'text-right' : 'text-left'}`}>
            <div className="text-xs text-gray-500 mb-1">
              {message.userId?.name} • {formatTime(message.createdAt)}
            </div>
            <div
              className={`inline-block p-3 rounded-lg ${
                isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: processedContent }}
                className="text-sm break-words"
              />
            </div>
            {message.taggedUsers && message.taggedUsers.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Tagged: {message.taggedUsers.map(u => u.name).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
              {date}
            </div>
          </div>
          {dateMessages.map(message => 
            renderMessage(message, message.userId._id === user.id)
          )}
        </div>
      ))}
      
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;