'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import supabase from '@/libs/supabase/client';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const tabs = ['Templates', 'Saved URLs', 'Activity'];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [profile, setProfile] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Templates');

  const email = user?.email;
  const avatar = user?.user_metadata?.avatar_url || '/default-avatar.png';
  const createdAt = user ? new Date(user.created_at).toLocaleDateString() : '';

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No profile yet
      setEditing(true);
    } else if (data) {
      setProfile(data);
      setNewUsername(data.username);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      alert('Failed to logout!');
    }
  };

  const handleUsernameSubmit = async () => {
    setLoading(true);
    setMessage('');

    if (!newUsername) {
      setMessage('Username cannot be empty.');
      setLoading(false);
      return;
    }

    const { data: existing, error: checkErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newUsername)
      .neq('id', user.id);

    if (checkErr) {
      setMessage('Error checking username');
      setLoading(false);
      return;
    }

    if (existing.length > 0) {
      setMessage('Username already taken.');
      setLoading(false);
      return;
    }

    if (profile) {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
      if (error) setMessage('Update failed.');
      else setMessage('Username updated!');
    } else {
      const { error } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          username: newUsername,
        },
      ]);
      if (error) setMessage('Failed to set username.');
      else setMessage('Username created!');
    }

    setEditing(false);
    fetchProfile();
    setLoading(false);
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user data...</p>;

  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-10 px-4 pt-20 ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}>
        <div className={`mx-auto max-w-2xl rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`rounded-full border-4 p-1 ${isDarkMode ? 'border-cyan-400' : 'border-blue-400'}`}>
              <Image src={avatar} alt="Profile Picture" width={100} height={100} className="rounded-full" />
            </div>

            {editing ? (
              <div className="mt-4 w-full">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={`w-full px-4 py-2 border rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                  placeholder="Enter a username"
                />
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    onClick={handleUsernameSubmit}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                  >
                    {loading ? 'Saving...' : profile ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className={`text-2xl font-bold mt-3 ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
                  {profile?.username}
                </h2>
                <p
                  className="text-sm text-blue-500 hover:underline cursor-pointer"
                  onClick={() => setEditing(true)}
                >
                  Edit Username
                </p>
              </>
            )}

            {message && (
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message}
              </p>
            )}

            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-2`}>{email}</p>
            <p className="text-sm text-gray-400">Member since: {createdAt}</p>
          </div>

          {/* Tabs */}
          <div className={`mb-4 flex justify-center gap-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold ${
                  activeTab === tab
                    ? isDarkMode
                      ? 'text-indigo-400 border-b-2 border-indigo-400'
                      : 'text-indigo-600 border-b-2 border-indigo-600'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
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

          {/* Social */}
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`text-xl transition ${isDarkMode ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-600 hover:text-yellow-400'}`}><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`text-xl transition ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'}`}><FaLinkedin /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`text-xl transition ${isDarkMode ? 'text-gray-300 hover:text-purple-300' : 'text-gray-600 hover:text-purple-400'}`}><FaTwitter /></a>
          </div>

          <div className="flex justify-center">
            <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
