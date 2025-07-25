import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalState, ActivityLogEntry } from '../../contexts/GlobalContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Lock, 
  Settings, 
  BookOpen, 
  Trophy, 
  Target,
  Github,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const { state: authState, updateProfile, changePassword } = useAuth();
  const { state: globalState, dispatch: globalDispatch } = useGlobalState();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    bio: authState.user?.bio || '',
    socialLinks: {
      linkedin: authState.user?.socialLinks?.linkedin || '',
      github: authState.user?.socialLinks?.github || '',
      twitter: authState.user?.socialLinks?.twitter || ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'module' | 'profile' | 'login' | 'other'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      // Add activity log entry for profile update
      globalDispatch({
        type: 'ADD_ACTIVITY_LOG_ENTRY',
        payload: {
          id: 'activity_' + Date.now(),
          type: 'profile',
          description: 'Updated profile information',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  if (!authState.user) {
    return <div>Please log in to view your profile.</div>;
  }

  const { user } = authState;

  return (
    <div className={`min-h-screen ${globalState.darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${globalState.darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            My Profile
          </h1>
          <p className={`text-lg ${globalState.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'profile' ? 'border-blue-500 text-blue-600 dark:text-blue-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === 'activity' ? 'border-blue-500 text-blue-600 dark:text-blue-300' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity Log
          </button>
        </div>
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Avatar Section (left column) */}
            <div className="flex flex-col items-center md:items-start md:col-span-1">
              <div className="relative inline-block mb-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className={`text-xl font-bold mt-2 ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
              <p className={`text-sm ${globalState.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>{user.progress.level}</div>
            </div>
            {/* Profile Info Section (right column) */}
            <div className="md:col-span-2">
              <div className={`${globalState.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}> 
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-semibold ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Information</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {/* Full Name, Email, Bio, Social Links fields as before */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          globalState.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    ) : (
                      <p className={`${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <p className={`${globalState.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email}
                    </p>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          globalState.darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div>
                        <p className={`${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formData.bio || <span className="text-gray-500 italic">No bio added yet.</span>}</p>
                        <button
                          className="text-blue-600 underline mt-2"
                          onClick={() => setIsEditing(true)}
                          type="button"
                        >
                          Edit Bio
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Social Links
                    </label>
                    <div className="space-y-3">
                      {['linkedin', 'github', 'twitter'].map((platform) => (
                        <div key={platform} className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
                            {platform === 'github' && <Github className="w-5 h-5 text-gray-800 dark:text-white" />}
                            {platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                          </div>
                          {isEditing ? (
                            <input
                              type="url"
                              value={formData.socialLinks[platform as keyof typeof formData.socialLinks]}
                              onChange={(e) => setFormData({
                                ...formData,
                                socialLinks: {
                                  ...formData.socialLinks,
                                  [platform]: e.target.value
                                }
                              })}
                              className={`flex-1 px-3 py-2 rounded-lg border ${
                                globalState.darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              placeholder={`Your ${platform} profile URL`}
                            />
                          ) : (
                            <span className={`${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {user.socialLinks?.[platform as keyof typeof user.socialLinks] || 'Not added'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className={`${globalState.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm mb-6`}>
            <h3 className={`text-xl font-semibold mb-6 ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Log</h3>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                className="border rounded px-2 py-1"
                value={activityTypeFilter}
                onChange={e => setActivityTypeFilter(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="module">Module</option>
                <option value="profile">Profile</option>
                <option value="login">Login</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {globalState.activityLog.length === 0 && (
                <li className="text-gray-400 italic">No activity yet.</li>
              )}
              {globalState.activityLog
                .filter(entry =>
                  (activityTypeFilter === 'all' || entry.type === activityTypeFilter) &&
                  (!dateFilter || entry.timestamp.startsWith(dateFilter))
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((activity, idx) => (
                  <li key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.type === 'module' && <BookOpen className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'profile' && <Edit className="w-5 h-5 text-green-500" />}
                      {activity.type === 'login' && <User className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'other' && <Settings className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <div className={`${globalState.darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{activity.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
            </ul>
            {/* Pagination/infinite scroll can be added here in the future */}
          </div>
        )}

        {/* Progress Summary */}
        <div className={`${globalState.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <h3 className={`text-xl font-semibold mb-6 ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Learning Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h4 className={`text-2xl font-bold ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.progress.coursesEnrolled.length}
              </h4>
              <p className={`text-sm ${globalState.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Courses Enrolled
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h4 className={`text-2xl font-bold ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.progress.completedModules}
              </h4>
              <p className={`text-sm ${globalState.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Modules Completed
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h4 className={`text-2xl font-bold ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.progress.totalPoints}
              </h4>
              <p className={`text-sm ${globalState.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Points
              </p>
            </div>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className={`${globalState.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
            <h3 className={`text-xl font-semibold mb-6 ${globalState.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Change Password
            </h3>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-sm text-red-700 dark:text-red-400">{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    globalState.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    globalState.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${globalState.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    globalState.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;