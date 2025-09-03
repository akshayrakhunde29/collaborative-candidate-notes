import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { userService } from '../../services/users';
import LoadingSpinner from '../common/LoadingSpinner';

const UserTagging = ({ query, onUserSelect, onClose, position }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (query.length >= 2) {
      searchUsers(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!users.length) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % users.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + users.length) % users.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onUserSelect(users[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [users, selectedIndex, onUserSelect, onClose]);

  const searchUsers = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await userService.searchUsers(searchQuery);
      setUsers(response.users);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Failed to search users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!query || query.length < 2) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-[200px]"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {loading ? (
        <div className="p-3 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      ) : users.length > 0 ? (
        <div className="py-1">
          {users.map((user, index) => (
            <div
              key={user._id}
              className={`px-3 py-2 cursor-pointer flex items-center space-x-2 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => onUserSelect(user)}
            >
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 text-sm text-gray-500 text-center">
          No users found matching "{query}"
        </div>
      )}
    </div>
  );
};

export default UserTagging;