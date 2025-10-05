'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaPencilAlt } from 'react-icons/fa';
import CloudinaryUploader from '@/libs/Cloudinary';
import Image from "next/image"

const tabs = ['Templates', 'Saved URLs', 'Activity'];

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [profile, setProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Templates');
  const [imageUrl, setImageUrl] = useState('/default-avatar.png');

  const email = user?.email;
  const createdAt = user ? new Date(user.created_at).toLocaleDateString() : '';

  useEffect(() => {
    if (user === null) {
      router.push('/auth');
    } else if (user) {
      fetchProfile();
    }
  }, [user]);

  // Fetch profile from API
  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/profile/${user.id}`);
      const json = await res.json();
      if (res.ok) {
        setProfile(json.profile);
        setNewUsername(json.profile?.username || '');
        setImageUrl(json.profile?.pic || '/default-avatar.png');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      alert('Failed to logout!');
    }
  };

  // Update profile using API
  const handleProfileSubmit = async () => {
    if (!newUsername.trim()) {
      setMessage('Username cannot be empty.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim(), pic: imageUrl }),
      });
      const json = await res.json();

      if (res.ok) {
        setProfile(json.profile);
        setMessage(json.message || 'Profile updated!');
        setEditing(false);
      } else {
        setMessage(json.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error while updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture using Cloudinary and update via API
  const handlePicUpload = async (file) => {
    try {
      const uploadedUrl = await CloudinaryUploader(file); // returns the uploaded image URL
      setImageUrl(uploadedUrl);

      // Update pic in profile
      await fetch(`/api/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pic: uploadedUrl }),
      });

      fetchProfile();
    } catch (err) {
      console.error('Failed to upload image', err);
      setMessage('Failed to upload profile picture');
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  
  return (
    <>
    
      <div className={`min-h-screen pt-30 px-4 py-10 ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-pink-50 to-purple-100'}`}>
        <div className={`mx-auto max-w-2xl  rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-900 border border-purple-800' : 'bg-white border border-pink-300'}`}>
          {/* Profile Pic */}
          <div className="flex flex-col items-center text-center mb-6 relative">
            <div className={`rounded-full border-4 p-1 relative ${isDarkMode ? 'border-pink-400' : 'border-purple-500'}`}>
              <Image
                src={imageUrl}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
              <CloudinaryUploader
                onUpload={handlePicUpload}
                enableDrag
                overlayClassName="absolute inset-0 rounded-full cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                <FaPencilAlt size={12} className="text-pink-600" />
              </div>
            </div>

            {/* Username */}
            {editing ? (
              <div className="mt-4 w-full space-y-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg text-center ${isDarkMode ? 'bg-gray-800 text-white border-purple-600' : 'bg-white text-black border-pink-400'}`}
                  placeholder="Enter a username"
                />
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    onClick={handleProfileSubmit}
                    disabled={loading}
                    className={`px-4 py-1 rounded-lg font-semibold transition ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:brightness-110'
                        : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:brightness-105'
                    }`}
                  >
                    {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
                  </button>
                </div>
              </div>
            ) : (
              <h2
                className={`text-2xl font-bold mt-3 ${isDarkMode ? 'text-white' : 'text-purple-800'}`}
              >
                {profile?.username}
                <FaPencilAlt
                  className="inline ml-2 cursor-pointer text-sm text-pink-400 hover:text-pink-600"
                  onClick={() => setEditing(true)}
                />
              </h2>
            )}

            {message && (
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`}>
                {message}
              </p>
            )}

            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-2`}>{email}</p>
            <p className="text-sm text-gray-400">Member since: {createdAt}</p>
          </div>

          {/* Tabs */}
          <div className={`mb-4 flex justify-center gap-4 border-b ${isDarkMode ? 'border-purple-700' : 'border-pink-200'}`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold transition ${
                  activeTab === tab
                    ? isDarkMode
                      ? 'text-pink-400 border-b-2 border-pink-400'
                      : 'text-purple-600 border-b-2 border-purple-600'
                    : isDarkMode
                    ? 'text-gray-500 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`text-center text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {activeTab === 'Templates' && <p>You haven’t uploaded any templates yet.</p>}
            {activeTab === 'Saved URLs' && <p>No saved URLs found.</p>}
            {activeTab === 'Activity' && <p>Recent activity will appear here.</p>}
          </div>

          {/* Logout */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
   
    </>
  );
};

