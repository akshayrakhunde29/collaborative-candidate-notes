import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useSocket } from '../../context/SocketContext';
import { messageService } from '../../services/messages';
import { useToast } from '../ui/use-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const NotesModal = ({ candidate, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && candidate && socket) {
      loadMessages();
      joinCandidateRoom();
      setupSocketListeners();
    }

    return () => {
      if (candidate && socket) {
        socket.emit('leave_candidate_room', candidate._id);
        cleanupSocketListeners();
      }
    };
  }, [isOpen, candidate, socket]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getMessages(candidate._id);
      setMessages(response.messages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const joinCandidateRoom = () => {
    socket.emit('join_candidate_room', candidate._id);
  };

  const setupSocketListeners = () => {
    socket.on('message_received', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
  };

  const cleanupSocketListeners = () => {
    socket.off('message_received', handleNewMessage);
    socket.off('user_typing', handleUserTyping);
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleUserTyping = ({ userId, userName, isTyping }) => {
    setTypingUsers(prev => {
      if (isTyping) {
        return prev.includes(userName) ? prev : [...prev, userName];
      } else {
        return prev.filter(name => name !== userName);
      }
    });

    // Clear typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(name => name !== userName));
      }, 3000);
    }
  };

  const handleSendMessage = (content, taggedUsers) => {
    if (!socket) return;

    socket.emit('send_message', {
      candidateId: candidate._id,
      content,
      taggedUsers
    });
  };

  const handleTyping = (isTyping) => {
    if (!socket) return;
    
    socket.emit('typing', {
      candidateId: candidate._id,
      isTyping
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Notes for {candidate?.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">{candidate?.email}</p>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <MessageList 
                messages={messages} 
                typingUsers={typingUsers}
              />
              <MessageInput 
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesModal;