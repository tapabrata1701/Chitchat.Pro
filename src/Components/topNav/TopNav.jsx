import React from "react";
import { FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase";

const TopNav = ({ activeTab, setActiveTab, currentUser }) => {
  const tabs = ["Chat", "Contacts", "Groups"];
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shrink-0">
      {/* Left side: Tabs */}
      <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full text-md font-semibold transition cursor-pointer
              ${activeTab === tab
                ? "bg-black text-white"
                : "bg-gray-100 text-black hover:bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right side: User Info & Icons */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {/* FIX: Use img tag for avatar */}
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
          <span className="text-md font-medium">{currentUser.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
            <FiBell className="text-xl" />
          </button>
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
            <FiSettings className="text-xl" />
          </button>
          <button 
            onClick={handleLogout}
            className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 cursor-pointer transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-xl text-red-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;