"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Upload } from "lucide-react";

interface ProfileDropdownProps {
  userName: string;
  userRole: string;
  userEmail: string;
  profileHref: string;
  settingsHref?: string;
  profileImage?: string;
  onImageUpload?: (file: File) => void;
}

export default function ProfileDropdown({
  userName,
  userRole,
  userEmail,
  profileHref,
  settingsHref,
  profileImage,
  onImageUpload,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
      >
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scaleIn z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href={profileHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User size={18} />
              <span className="text-sm">My Profile</span>
            </Link>

            {settingsHref && (
              <Link
                href={settingsHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </Link>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Upload size={18} />
              <span className="text-sm">Upload Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
