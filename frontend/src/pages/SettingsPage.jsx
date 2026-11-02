import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Settings,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  Database,
  Server,
  Camera,
  Upload,
  Trash2,
  X,
  Loader2
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, refreshUser, updateUser } = useAuth();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const [picSuccess, setPicSuccess] = useState('');
  const [picError, setPicError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPicError('');
    setPicSuccess('');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setPicError('Only JPG, JPEG, PNG, and WebP image formats are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPicError('Image file size must be less than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPicError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    setPicLoading(true);
    setPicError('');
    setPicSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const res = await api.post('/auth/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        if (updateUser) {
          updateUser(res.data.data);
        } else {
          await refreshUser();
        }
        setPicSuccess('Profile picture updated successfully.');
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setPicSuccess(''), 5000);
      }
    } catch (err) {
      setPicError(err.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setPicLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPicLoading(true);
    setPicError('');
    setPicSuccess('');

    try {
      const res = await api.delete('/auth/profile-picture');
      if (res.data?.success) {
        if (updateUser) {
          updateUser(res.data.data);
        } else {
          await refreshUser();
        }
        setPicSuccess('Profile picture removed successfully.');
        handleCancelPreview();
        setTimeout(() => setPicSuccess(''), 5000);
      }
    } catch (err) {
      setPicError(err.response?.data?.message || 'Failed to remove profile picture.');
    } finally {
      setPicLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);
    setPwdError('');
    setPwdSuccess('');

    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      if (res.data?.success) {
        setPwdSuccess('Your password has been changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwdSuccess(''), 6000);
      }
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Could not update password. Please check your current password.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Account & Security Settings</h2>
        <p className="text-xs text-[#737373]">
          Manage your personal profile, credentials, and ledger environment
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="fintech-card p-6 space-y-6">
        {picSuccess && (
          <div className="p-3.5 rounded-xl bg-fintech-greenSubtle border border-fintech-green/30 text-xs font-mono text-fintech-green flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{picSuccess}</span>
          </div>
        )}

        {picError && (
          <div className="p-3.5 rounded-xl bg-fintech-redSubtle border border-fintech-red/30 text-xs font-mono text-fintech-red flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>{picError}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-[#242424]">
          <div className="flex items-center gap-4">
            {/* Avatar Container */}
            <div className="relative w-14 h-14 rounded-2xl bg-[#242424] border border-[#333333] flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0 shadow-inner">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.fullName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.fullName?.charAt(0) || 'U'}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{user?.fullName}</h3>
                {previewUrl && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Preview Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-[#737373] font-mono">{user?.email}</p>

              {/* Profile Picture Actions */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />

                {previewUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSavePhoto}
                      disabled={picLoading}
                      className="px-2.5 py-1 rounded-lg bg-white text-black font-semibold text-[11px] hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      {picLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>Save Picture</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPreview}
                      disabled={picLoading}
                      className="px-2.5 py-1 rounded-lg bg-[#242424] border border-[#383838] text-[#A3A3A3] hover:text-white text-[11px] font-medium transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={picLoading}
                      className="px-2.5 py-1 rounded-lg bg-[#242424] border border-[#383838] text-white hover:border-[#555555] text-[11px] font-medium transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{user?.profilePicture ? 'Change Picture' : 'Upload Picture'}</span>
                    </button>
                    {user?.profilePicture && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={picLoading}
                        className="px-2.5 py-1 rounded-lg bg-[#1f1616] border border-[#3d2424] text-[#EF4444] hover:bg-[#2e1d1d] text-[11px] font-medium transition-all flex items-center gap-1"
                        title="Remove profile picture"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-white/10 text-white font-semibold">
              {user?.role}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-fintech-greenSubtle text-fintech-green border border-fintech-green/30">
              {user?.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
            <span className="text-[#737373] block mb-1">User Identifier</span>
            <span className="text-white text-[11px] truncate block">{user?.id}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
            <span className="text-[#737373] block mb-1">Ledger Tenant</span>
            <span className="text-white text-[11px]">Strictly Isolated (MongoDB)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
            <span className="text-[#737373] block mb-1">Account Created</span>
            <span className="text-white text-[11px]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <KeyRound className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white">Update Account Password</h3>
        </div>

        {pwdSuccess && (
          <div className="p-3.5 rounded-xl bg-fintech-greenSubtle border border-fintech-green/30 text-xs font-mono text-fintech-green flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3.5 rounded-xl bg-fintech-redSubtle border border-fintech-red/30 text-xs font-mono text-fintech-red">
            {pwdError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {pwdLoading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>

      {/* System & Database Architecture Card */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Database className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white">System Architecture & Database</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-fintech-green" />
              <span className="text-white font-medium">MongoDB Native Service</span>
            </div>
            <span className="font-mono text-[#737373]">port 27017 • Decimal128 Active</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-fintech-green" />
              <span className="text-white font-medium">Spring Boot REST API</span>
            </div>
            <span className="font-mono text-[#737373]">port 8080 • Java 17 • Spring Security 6</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#242424]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-fintech-green" />
              <span className="text-white font-medium">Automated Recurring Scheduler</span>
            </div>
            <span className="font-mono text-[#737373]">@Scheduled Hourly & Daily Active</span>
          </div>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="fintech-card p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Lock className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white">Security & Cryptography</h3>
        </div>
        <p className="text-xs text-[#A3A3A3] leading-relaxed">
          Your account uses BCrypt password hashing and HMAC-SHA256 authenticated JSON Web Tokens. Financial amounts are calculated with strict IEEE 754-2008 Decimal128 representation, eliminating rounding errors.
        </p>
      </div>
    </div>
  );
};
