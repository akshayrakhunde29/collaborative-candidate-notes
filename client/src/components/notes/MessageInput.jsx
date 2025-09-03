import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import UserTagging from './UserTagging';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showTagging, setShowTagging] = useState(false);
  const [tagPosition, setTagPosition] = useState({ top: 0, left: 0 });
  const [currentTag, setCurrentTag] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    onTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);

    // Handle @ mentions
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (atMatch) {
      setCurrentTag(atMatch[1]);
      setShowTagging(true);
      
      // Calculate position for dropdown
      const textarea = textareaRef.current;
      const rect = textarea.getBoundingClientRect();
      setTagPosition({
        top: rect.top - 200,
        left: rect.left + 10
      });
    } else {
      setShowTagging(false);
      setCurrentTag('');
    }
  };

  const handleUserSelect = (user) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    
    // Replace the partial @ mention with the complete username
    const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@${user.name} `);
    const newMessage = newTextBefore + textAfterCursor;
    
    setMessage(newMessage);
    setShowTagging(false);
    
    // Add user to tagged list if not already included
    if (!taggedUsers.find(u => u._id === user._id)) {
      setTaggedUsers(prev => [...prev, user]);
    }

    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursorPosition = newTextBefore.length;
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    // Extract tagged user IDs from the message
    const taggedUserIds = taggedUsers.map(user => user._id);
    
    onSendMessage(message.trim(), taggedUserIds);
    setMessage('');
    setTaggedUsers([]);
    onTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="border-t bg-white p-4">
      {/* Tagged users display */}
      {taggedUsers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {taggedUsers.map(user => (
            <div
              key={user._id}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              @{user.name}
              <button
                onClick={() => setTaggedUsers(prev => prev.filter(u => u._id !== user._id))}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... Use @username to tag someone"
            className="min-h-[40px] max-h-32 resize-none"
            rows={1}
          />
          
          {/* User tagging dropdown */}
          {showTagging && (
            <UserTagging
              query={currentTag}
              onUserSelect={handleUserSelect}
              onClose={() => setShowTagging(false)}
              position={tagPosition}
            />
          )}
        </div>
        
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;