import { useState, useEffect, useCallback } from 'react';
import { InboxMessage } from '../types/common';
import { inboxService } from '../services/otherServices';

export const useInbox = (userId: string) => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedMessages = await inboxService.getMessages(userId);
      setMessages(fetchedMessages);
      
      // Update unread count
      const unreadMessages = fetchedMessages.filter(msg => !msg.isRead);
      setUnreadCount(unreadMessages.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const updatedMessage = await inboxService.markAsRead(messageId);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return updatedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark message as read');
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await inboxService.markAllAsRead(userId);
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all messages as read');
      throw err;
    }
  }, [userId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await inboxService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Update unread count if the deleted message was unread
      const deletedMessage = messages.find(msg => msg.id === messageId);
      if (deletedMessage && !deletedMessage.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
      throw err;
    }
  }, [messages]);

  const refreshMessages = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    refreshMessages,
  };
};

export const useUnreadCount = (userId: string) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) return;
      
      try {
        const count = await inboxService.getUnreadCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();
  }, [userId]);

  return { unreadCount, loading };
};