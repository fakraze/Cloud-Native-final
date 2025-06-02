import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useInbox } from '../hooks/useInbox';
import { InboxMessage } from '../types/common';
import { 
  EnvelopeIcon, 
  EnvelopeOpenIcon, 
  TrashIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const MessageTypeIcon: React.FC<{ type: InboxMessage['type'] }> = ({ type }) => {
  const iconClasses = "h-5 w-5";
  
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${iconClasses} text-green-500`} />;
    case 'error':
      return <XCircleIcon className={`${iconClasses} text-red-500`} />;
    case 'warning':
      return <ExclamationTriangleIcon className={`${iconClasses} text-yellow-500`} />;
    case 'info':
    default:
      return <InformationCircleIcon className={`${iconClasses} text-blue-500`} />;
  }
};

const MessageCard: React.FC<{
  message: InboxMessage;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ message, onMarkAsRead, onDelete }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAsRead = () => {
    if (!message.isRead) {
      onMarkAsRead(message.id);
    }
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <div 
      className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
        message.isRead 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <MessageTypeIcon type={message.type} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`text-sm font-medium ${
                message.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
              }`}>
                {message.title}
              </h3>
              {!message.isRead && (
                <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
            
            <p className={`text-sm ${
              message.isRead ? 'text-gray-600' : 'text-gray-700'
            } break-words`}>
              {message.message}
            </p>
            
            <p className="text-xs text-gray-500 mt-2">
              {formatTimeAgo(message.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
          {!message.isRead && (
            <button
              onClick={handleMarkAsRead}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Mark as read"
            >
              <EnvelopeOpenIcon className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete message"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Inbox: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    messages, 
    loading, 
    error, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteMessage, 
    refreshMessages 
  } = useInbox(user?.id || '');

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">Error loading messages: {error}</p>
          </div>
          <button
            onClick={refreshMessages}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <EnvelopeIcon className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshMessages}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Refresh
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <EnvelopeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
          <p className="text-gray-500">You're all caught up! No messages in your inbox.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;