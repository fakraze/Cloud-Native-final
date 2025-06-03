import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useInbox } from '../../hooks/useInbox';
import { InboxMessage } from '../../types/common';
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

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
      !message.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <MessageTypeIcon type={message.type} />
            <h3 className={`text-lg font-semibold ${
              !message.isRead ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {message.title}
            </h3>
            {!message.isRead && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {message.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {formatTimeAgo(message.createdAt)}
            </span>
            
            <div className="flex items-center space-x-2">
              {!message.isRead && (
                <button
                  onClick={() => onMarkAsRead(message.id)}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark as Read
                </button>
              )}
              
              <button
                onClick={() => onDelete(message.id)}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminInbox: React.FC = () => {
  const { user } = useAuthStore();
  const { messages, markAsRead, deleteMessage, markAllAsRead } = useInbox(user?.id || '');

  const unreadMessages = messages.filter(message => !message.isRead);
  const readMessages = messages.filter(message => message.isRead);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      try {
        // Delete all messages one by one since there's no bulk delete method
        await Promise.all(messages.map(message => deleteMessage(message.id)));
      } catch (error) {
        console.error('Failed to delete all messages:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Inbox</h1>
                <p className="text-gray-600">
                  {messages.length === 0 
                    ? 'No messages' 
                    : `${messages.length} total message${messages.length !== 1 ? 's' : ''}, ${unreadMessages.length} unread`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {messages.length > 0 && (
                <>
                  {unreadMessages.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Mark All as Read
                    </button>
                  )}
                  
                  <button
                    onClick={handleDeleteAll}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeOpenIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">
              When you receive notifications, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unread Messages */}
            {unreadMessages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
                    {unreadMessages.length}
                  </span>
                  Unread Messages
                </h2>
                <div className="space-y-4">
                  {unreadMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Read Messages */}
            {readMessages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <EnvelopeOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
                  Read Messages
                </h2>
                <div className="space-y-4">
                  {readMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;
