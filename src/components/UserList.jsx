import React, { useState } from 'react';
import ArrowIcon from './ArrowIcon';

function UserList({ users }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-50 flex items-center transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}>
      {/* User List Panel */}
      <div className="w-64 h-auto max-h-[60vh] bg-neutral-900/90 backdrop-blur-md rounded-r-lg shadow-lg overflow-y-auto">
        <h2 className="text-lg font-semibold text-white p-4 border-b border-neutral-700">Active Users ({users.length})</h2>
        <ul className="p-2">
          {users.map((user) => (
            <li key={user.id} className="px-2 py-1.5 text-white/90 truncate">
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-500 text-white w-6 h-9 rounded-r-full flex items-center justify-center focus:outline-none shadow-md ml-1"
      >
        <ArrowIcon isOpen={isOpen} />
      </button>
    </div>
  );
}

export default UserList;
