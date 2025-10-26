import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import TopNav from "../topNav/TopNav";
import LeftSidebar from "../sideBar/Sidebar";
import ChatWindow from "./ChatWindow";
import RightProfileSidebar from "./RightProfileSidebar";
import { users as initialUsers, messages as initialMessages, groups as initialGroups } from "../../data";

const ChatLayout = () => {
  const [activeTab, setActiveTab] = useState("Chat");
  const [selectedChatId, setSelectedChatId] = useState("Subho_09");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState(initialUsers);
  const [groups, setGroups] = useState(initialGroups);
  const [messages, setMessages] = useState(initialMessages);

  // Combine users and groups into one lookup object
  const allChats = { ...users, ...groups };
  const selectedChat = allChats[selectedChatId];
  const selectedChatMessages = messages[selectedChatId] || [];

  const handleSendMessage = (text) => {
    if (!selectedChatId || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      sender: currentUser.id,
    };
    
    // Update the messages state for the current chat
    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedChatId]: [...(prevMessages[selectedChatId] || []), newMessage]
    }));

    // Update the last message for the user/group in the sidebar
    if (allChats[selectedChatId].members) { // It's a group
        setGroups(prev => ({ ...prev, [selectedChatId]: { ...prev[selectedChatId], lastMessage: `${currentUser.name}: ${text}` }}));
    } else { // It's a user
        setUsers(prev => ({ ...prev, [selectedChatId]: { ...prev[selectedChatId], lastMessage: text }}));
    }
  };
  
  // Determine which list to show in the sidebar based on the active tab
  let sidebarList = [];
  if (activeTab === 'Chat') {
    // Show users and groups that have messages
    sidebarList = Object.values({ ...users, ...groups }).filter(c => messages[c.id] && messages[c.id].length > 0);
  } else if (activeTab === 'Contacts') {
    sidebarList = Object.values(users);
  } else if (activeTab === 'Groups') {
    sidebarList = Object.values(groups);
  }

  // Fetch current user data from Firestore
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&color=fff`
            });
          } else {
            // Fallback if user document doesn't exist
            setCurrentUser({
              id: auth.currentUser.uid,
              name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
              email: auth.currentUser.email,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.currentUser.displayName || auth.currentUser.email.split('@')[0])}&background=random&color=fff`
            });
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Fallback user data
        setCurrentUser({
          id: auth.currentUser?.uid || "unknown",
          name: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "User",
          email: auth.currentUser?.email || "",
          avatar: "https://ui-avatars.com/api/?name=User&background=random&color=fff"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Auto-select the first item in the list if the current selection disappears
  useEffect(() => {
    const isSelectedVisible = sidebarList.some(item => item.id === selectedChatId);
    if (!isSelectedVisible && sidebarList.length > 0) {
      setSelectedChatId(sidebarList[0].id);
    } else if (sidebarList.length === 0) {
      setSelectedChatId(null);
    }
  }, [activeTab, sidebarList, selectedChatId]);


  // Show loading state while fetching user data
  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F7F7F7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7]">
      <TopNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser} 
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          items={sidebarList}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
        />

        <main className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              messages={selectedChatMessages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat or contact to start messaging.
            </div>
          )}
        </main>

        {selectedChat && <RightProfileSidebar data={selectedChat} />}
      </div>
    </div>
  );
};

export default ChatLayout;