import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  Edit3, 
  Save, 
  X,
  Shield,
  Settings
} from 'lucide-react';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  location: string;
  shiftType: string;
}

const StaffPersonal: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: 'Staff Member',
    email: 'staff@test.com',
    phone: '+1 (555) 0123',
    position: 'Restaurant Staff',
    department: 'Operations',
    startDate: '2023-06-15',
    location: 'Main Location',
    shiftType: 'Full-time'
  });

  const [editedInfo, setEditedInfo] = useState<PersonalInfo>(personalInfo);

  const handleSave = () => {
    setPersonalInfo(editedInfo);
    setIsEditing(false);
    // In a real app, this would make an API call to update the user info
  };

  const handleCancel = () => {
    setEditedInfo(personalInfo);
    setIsEditing(false);
  };

  const workSchedule = [
    { day: 'Monday', shift: '9:00 AM - 5:00 PM', status: 'scheduled' },
    { day: 'Tuesday', shift: '9:00 AM - 5:00 PM', status: 'scheduled' },
    { day: 'Wednesday', shift: '9:00 AM - 5:00 PM', status: 'scheduled' },
    { day: 'Thursday', shift: '9:00 AM - 5:00 PM', status: 'scheduled' },
    { day: 'Friday', shift: '9:00 AM - 5:00 PM', status: 'scheduled' },
    { day: 'Saturday', shift: 'Off', status: 'off' },
    { day: 'Sunday', shift: 'Off', status: 'off' }
  ];

  const permissions = [
    { name: 'View Orders', granted: true, description: 'View all restaurant orders' },
    { name: 'Update Order Status', granted: true, description: 'Change order status and progress' },
    { name: 'POS Access', granted: true, description: 'Access point of sale system' },
    { name: 'Customer Service', granted: true, description: 'Handle customer inquiries' },
    { name: 'Inventory View', granted: false, description: 'View inventory levels' },
    { name: 'Financial Reports', granted: false, description: 'Access financial data' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInfo.name}
                    onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{personalInfo.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedInfo.email}
                    onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{personalInfo.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedInfo.phone}
                    onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{personalInfo.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInfo.position}
                    onChange={(e) => setEditedInfo({ ...editedInfo, position: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{personalInfo.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <p className="text-gray-900">{personalInfo.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{new Date(personalInfo.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{personalInfo.location}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <p className="text-gray-900">{personalInfo.shiftType}</p>
              </div>
            </div>
          </div>

          {/* Work Schedule */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Work Schedule</h2>
            </div>

            <div className="space-y-3">
              {workSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 w-20">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.shift}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {schedule.status === 'scheduled' ? 'Scheduled' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions and Settings */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Permissions</h2>
            </div>

            <div className="space-y-3">
              {permissions.map((permission, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${
                      permission.granted ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{permission.name}</h4>
                    <p className="text-xs text-gray-600">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Change Password</div>
                <div className="text-sm text-gray-600">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Notification Settings</div>
                <div className="text-sm text-gray-600">Manage notification preferences</div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Request Time Off</div>
                <div className="text-sm text-gray-600">Submit time off requests</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPersonal;
