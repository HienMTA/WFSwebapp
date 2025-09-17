
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Settings</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Coming Soon</h3>
        <p className="text-gray-600 dark:text-gray-400">
          This section will contain user profile settings, application preferences, API key management, and system configuration options.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
