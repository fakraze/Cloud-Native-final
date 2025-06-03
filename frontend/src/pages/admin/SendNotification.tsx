import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendNotification } from '../../hooks/useInbox';
import { 
  BellIcon,
  UserGroupIcon,
  UserIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

type MessageType = 'info' | 'success' | 'warning' | 'error';

interface NotificationForm {
  title: string;
  message: string;
  type: MessageType;
  sendToAll: boolean;
  selectedEmployeeId?: string;
}

const MessageTypeIcon: React.FC<{ type: MessageType; className?: string }> = ({ type, className = "h-5 w-5" }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-500`} />;
    case 'error':
      return <XCircleIcon className={`${className} text-red-500`} />;
    case 'warning':
      return <ExclamationTriangleIcon className={`${className} text-yellow-500`} />;
    case 'info':
    default:
      return <InformationCircleIcon className={`${className} text-blue-500`} />;
  }
};

const SendNotification: React.FC = () => {
  const navigate = useNavigate();
  const { sendToAllEmployees, sendToEmployee, employees, isLoading } = useSendNotification();
  
  const [form, setForm] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'info',
    sendToAll: true,
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageTypes: { value: MessageType; label: string; description: string }[] = [
    { value: 'info', label: 'Information', description: 'General information or announcements' },
    { value: 'success', label: 'Success', description: 'Positive updates or confirmations' },
    { value: 'warning', label: 'Warning', description: 'Important notices that need attention' },
    { value: 'error', label: 'Error', description: 'Critical issues or problems' },
  ];

  const handleInputChange = (field: keyof NotificationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentReminder = () => {
    setForm(prev => ({
      ...prev,
      title: 'Monthly Payment Reminder',
      message: 'Dear team member,\n\nThis is a friendly reminder that your monthly payment is due at the end of this month. Please ensure you have completed all necessary payment procedures.\n\nIf you have any questions or concerns, please don\'t hesitate to reach out to the admin team.\n\nThank you for your attention to this matter.\n\nBest regards,\nAdmin Team',
      type: 'warning'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    setIsSubmitting(true);
    try {
      if (form.sendToAll) {
        await sendToAllEmployees(form.title, form.message, form.type);
      } else if (form.selectedEmployeeId) {
        await sendToEmployee(form.selectedEmployeeId, form.title, form.message, form.type);
      }
      
      // Reset form and navigate back to inbox
      setForm({
        title: '',
        message: '',
        type: 'info',
        sendToAll: true,
      });
      
      navigate('/admin/inbox');
    } catch (error) {
      console.error('Failed to send notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.title.trim() && form.message.trim() && 
    (form.sendToAll || form.selectedEmployeeId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/inbox')}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
                <p className="text-gray-600">Send notifications to employees</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
                  <button
                    type="button"
                    onClick={handlePaymentReminder}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    <BellIcon className="h-4 w-4 mr-2" />
                    Payment Reminder Template
                  </button>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Send To
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="send-all"
                        type="radio"
                        checked={form.sendToAll}
                        onChange={() => handleInputChange('sendToAll', true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="send-all" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        All Employees ({employees.length})
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="send-individual"
                        type="radio"
                        checked={!form.sendToAll}
                        onChange={() => handleInputChange('sendToAll', false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="send-individual" className="ml-3 flex items-center text-sm font-medium text-gray-700">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Specific Employee
                      </label>
                    </div>
                    
                    {!form.sendToAll && (
                      <select
                        value={form.selectedEmployeeId || ''}
                        onChange={(e) => handleInputChange('selectedEmployeeId', e.target.value)}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select an employee...</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} ({employee.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Message Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Message Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {messageTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`relative cursor-pointer rounded-lg border p-3 transition-colors ${
                          form.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange('type', type.value)}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={form.type === type.value}
                            onChange={() => handleInputChange('type', type.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <div className="ml-3 flex items-center">
                            <MessageTypeIcon type={type.value} className="h-4 w-4 mr-2" />
                            <span className="block text-sm font-medium text-gray-700">
                              {type.label}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter notification title..."
                    maxLength={100}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {form.title.length}/100 characters
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Enter your message..."
                    rows={8}
                    maxLength={1000}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {form.message.length}/1000 characters
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/inbox')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting || isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Notification'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              
              {showPreview && form.title && form.message ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <MessageTypeIcon type={form.type} className="h-5 w-5 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {form.title}
                      </h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {form.message}
                      </p>
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Admin</span>
                        <span>Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Enter title and message to see preview</p>
                </div>
              )}

              {/* Recipients Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recipients</h4>
                <div className="text-sm text-gray-600">
                  {form.sendToAll ? (
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      All employees ({employees.length})
                    </div>
                  ) : form.selectedEmployeeId ? (
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {employees.find(e => e.id === form.selectedEmployeeId)?.name || 'Selected employee'}
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <UserIcon className="h-4 w-4 mr-2" />
                      No recipient selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
