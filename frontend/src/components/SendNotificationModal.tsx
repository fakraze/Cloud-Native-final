import React, { useState } from 'react';
import { 
  XMarkIcon, 
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { InboxMessage } from '../types/common';
import { useSendNotification } from '../hooks/useInbox';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<InboxMessage['type']>('info');
  const { sendToAllEmployees, loading, error } = useSendNotification();

  const messageTypes = [
    { value: 'info', label: 'Information', icon: InformationCircleIcon, color: 'text-blue-500' },
    { value: 'success', label: 'Success', icon: CheckCircleIcon, color: 'text-green-500' },
    { value: 'warning', label: 'Warning', icon: ExclamationTriangleIcon, color: 'text-yellow-500' },
    { value: 'error', label: 'Error', icon: XCircleIcon, color: 'text-red-500' },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      return;
    }

    try {
      await sendToAllEmployees(title.trim(), message.trim(), type);
      
      // Reset form
      setTitle('');
      setMessage('');
      setType('info');
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleQuickPaymentReminder = () => {
    setTitle('Monthly Payment Reminder');
    setMessage('This is a reminder that your monthly payment is due at the end of this month. Please ensure your payment is processed on time to avoid any service interruptions. Thank you for your cooperation.');
    setType('warning');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Send Notification</h2>
              <p className="text-sm text-gray-600">Send a notification to all employees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <button
              type="button"
              onClick={handleQuickPaymentReminder}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-500" />
              Payment Reminder Template
            </button>
          </div>

          {/* Message Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Message Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {messageTypes.map((messageType) => (
                <label
                  key={messageType.value}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    type === messageType.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={messageType.value}
                    checked={type === messageType.value}
                    onChange={(e) => setType(e.target.value as InboxMessage['type'])}
                    className="sr-only"
                  />
                  <messageType.icon className={`h-5 w-5 mr-2 ${messageType.color}`} />
                  <span className="text-sm font-medium text-gray-900">
                    {messageType.label}
                  </span>
                  {type === messageType.value && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter notification title"
              maxLength={100}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {title.length}/100 characters
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter notification message"
              maxLength={500}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {message.length}/500 characters
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Preview */}
          {(title || message) && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  {messageTypes.find(mt => mt.value === type)?.icon && (
                    React.createElement(messageTypes.find(mt => mt.value === type)!.icon, {
                      className: `h-5 w-5 ${messageTypes.find(mt => mt.value === type)!.color}`
                    })
                  )}
                  <h5 className="font-medium text-gray-900">{title || 'Title'}</h5>
                </div>
                <p className="text-sm text-gray-600">{message || 'Message content will appear here'}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !message.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              Send to All Employees
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
