import React, { useState, useEffect } from 'react';

const ChatDashboardPrototype = () => {
  // State management
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatType, setActiveChatType] = useState('private');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMetric, setActiveMetric] = useState('pending');
  
  // Sample data
  const [chats, setChats] = useState([
    { id: 1, type: 'private', name: 'Sarah Johnson', unread: 2, messages: [
      { id: 1, sender: 'Sarah Johnson', content: 'Hi there! Do you have time for a quick meeting today?', time: '9:30 AM', priority: 'normal' },
      { id: 2, sender: 'Me', content: 'Sure, I\'m free after 2 PM', time: '9:35 AM', priority: 'normal' },
      { id: 3, sender: 'Sarah Johnson', content: 'Great! Let\'s meet at 3 PM in Room A102. @you Please bring the project report.', time: '9:40 AM', priority: 'high', tagged: true },
    ]},
    { id: 2, type: 'private', name: 'David Miller', unread: 0, messages: [
      { id: 1, sender: 'David Miller', content: 'Have you reviewed the bug report?', time: '8:15 AM', priority: 'normal' },
      { id: 2, sender: 'Me', content: 'Working on it now', time: '8:20 AM', priority: 'normal' },
    ]},
    { id: 3, type: 'group', name: 'Product Team', unread: 5, messages: [
      { id: 1, sender: 'Alex Chen', content: 'Team, our next sprint planning is tomorrow', time: 'Yesterday', priority: 'normal' },
      { id: 2, sender: 'Emily Wong', content: '@everyone Please update your tasks on the board before the meeting', time: 'Yesterday', priority: 'high', tagged: true },
    ]},
    { id: 4, type: 'group', name: 'Design Review', unread: 0, messages: [
      { id: 1, sender: 'Lisa Park', content: 'New mockups are ready for review', time: 'Yesterday', priority: 'normal' },
      { id: 2, sender: 'Me', content: 'They look great! I have a few suggestions for the navigation', time: 'Yesterday', priority: 'normal' },
    ]},
  ]);
  
  // Dashboard data
  const pendingTasksData = {
    high: 8,
    medium: 15,
    low: 7
  };
  
  const performanceData = [
    { month: 'Jan', rate: 75 },
    { month: 'Feb', rate: 78 },
    { month: 'Mar', rate: 82 },
    { month: 'Apr', rate: 85 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 92 }
  ];
  
  const completedWorkData = [
    { category: 'Bugs Fixed', count: 24 },
    { category: 'Features Developed', count: 18 },
    { category: 'Documents Completed', count: 32 }
  ];
  
  const notificationsData = [
    { type: 'Mentions', count: 12 },
    { type: 'Meeting Reminders', count: 8 },
    { type: 'Deadlines', count: 5 },
    { type: 'Project Updates', count: 15 }
  ];
  
  // Helper functions
  const handleSendMessage = () => {
    if (message.trim() === '' || !selectedChat) return;
    
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: 'Me',
              content: message,
              time: getCurrentTime(),
              priority: 'normal'
            }
          ]
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setMessage('');
    
    // Update selected chat
    setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id));
  };
  
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };
  
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    
    // Mark as read
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    
    setChats(updatedChats);
  };
  
  const setPriority = (chatId, messageId, priority) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, priority };
            }
            return msg;
          })
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setSelectedChat(updatedChats.find(chat => chat.id === chatId));
  };
  
  const filteredChats = chats.filter(chat => 
    chat.type === activeChatType && 
    (searchQuery === '' || 
     chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     chat.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // Visualizations
  const renderPendingTasksChart = () => {
    const total = pendingTasksData.high + pendingTasksData.medium + pendingTasksData.low;
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Pending Tasks by Priority</h3>
        <div className="flex items-end h-48 space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-16 bg-red-500" style={{height: `${(pendingTasksData.high/total) * 200}px`}}></div>
            <div className="mt-2">High ({pendingTasksData.high})</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 bg-yellow-500" style={{height: `${(pendingTasksData.medium/total) * 200}px`}}></div>
            <div className="mt-2">Medium ({pendingTasksData.medium})</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 bg-green-500" style={{height: `${(pendingTasksData.low/total) * 200}px`}}></div>
            <div className="mt-2">Low ({pendingTasksData.low})</div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPerformanceChart = () => {
    const maxRate = Math.max(...performanceData.map(d => d.rate));
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Performance Improvement Over Time</h3>
        <div className="h-48 flex items-end">
          <div className="h-full flex items-end space-x-2">
            {performanceData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-blue-500" 
                  style={{height: `${(data.rate/100) * 200}px`}}
                ></div>
                <div className="mt-2 text-xs">{data.month}</div>
                <div className="text-xs">{data.rate}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderCompletedWorkChart = () => {
    const total = completedWorkData.reduce((sum, item) => sum + item.count, 0);
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Completed Work Overview</h3>
        <div className="flex items-end h-48">
          <div className="h-full flex items-end">
            <div className="flex items-end h-48">
              {completedWorkData.map((data, index) => (
                <div key={index} className="flex flex-col items-center mx-4">
                  <div 
                    className={`w-16 ${index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-indigo-500' : 'bg-teal-500'}`}
                    style={{height: `${(data.count/total) * 200}px`}}
                  ></div>
                  <div className="mt-2 text-sm">{data.category}</div>
                  <div className="text-xs">{data.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderNotificationsChart = () => {
    const total = notificationsData.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Notifications Dashboard</h3>
        <div className="flex justify-center">
          <div className="relative h-48 w-48">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {notificationsData.map((item, index) => {
                const percentage = (item.count / total);
                const angle = percentage * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                const endAngleRad = (startAngle + angle - 90) * (Math.PI / 180);
                
                const x1 = 50 + 40 * Math.cos(startAngleRad);
                const y1 = 50 + 40 * Math.sin(startAngleRad);
                const x2 = 50 + 40 * Math.cos(endAngleRad);
                const y2 = 50 + 40 * Math.sin(endAngleRad);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const colors = ['#4299e1', '#667eea', '#9f7aea', '#ed64a6'];
                
                return (
                  <path 
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                  />
                );
              })}
              <circle cx="50" cy="50" r="20" fill="white" />
            </svg>
          </div>
          <div className="ml-4 flex flex-col justify-center">
            {notificationsData.map((item, index) => {
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
              return (
                <div key={index} className="flex items-center mb-2">
                  <div className={`w-4 h-4 ${colors[index % colors.length]} mr-2`}></div>
                  <div>{item.type} ({item.count})</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderWorkloadHeatmap = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeSlots = ['9am', '11am', '1pm', '3pm', '5pm'];
    
    // Simulated heatmap data (higher value = higher workload)
    const heatmapData = [
      [0.2, 0.5, 0.8, 0.3, 0.1],
      [0.4, 0.9, 0.7, 0.5, 0.3],
      [0.3, 0.4, 1.0, 0.8, 0.2],
      [0.5, 0.6, 0.5, 0.4, 0.1],
      [0.1, 0.3, 0.6, 0.7, 0.4],
    ];
    
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Workload Distribution</h3>
        <div className="grid grid-cols-6 gap-1">
          <div className=""></div>
          {daysOfWeek.map((day, i) => (
            <div key={i} className="text-center text-sm font-medium">{day}</div>
          ))}
          
          {timeSlots.map((time, i) => (
            <React.Fragment key={i}>
              <div className="text-right pr-2 text-sm">{time}</div>
              {daysOfWeek.map((_, j) => {
                const intensity = heatmapData[i][j];
                const r = Math.floor(255 * Math.min(1, intensity * 2));
                const g = Math.floor(255 * Math.max(0, 1 - intensity * 1.5));
                const b = Math.floor(100 * Math.max(0, 1 - intensity * 2));
                return (
                  <div 
                    key={j}
                    className="h-8 rounded"
                    style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                  ></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  const renderProjectSuccessChart = () => {
    const projectData = [
      { name: 'Project A', success: 85, failure: 15 },
      { name: 'Project B', success: 70, failure: 30 },
      { name: 'Project C', success: 92, failure: 8 },
    ];
    
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Project Success and Failure Rates</h3>
        <div className="h-48 flex items-end space-x-8">
          {projectData.map((project, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-end">
                <div className="w-12 bg-green-500 mr-1" style={{height: `${project.success * 2}px`}}></div>
                <div className="w-12 bg-red-500" style={{height: `${project.failure * 2}px`}}></div>
              </div>
              <div className="mt-2">{project.name}</div>
              <div className="text-xs text-green-600">{project.success}% Success</div>
              <div className="text-xs text-red-600">{project.failure}% Failure</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Workspace Dashboard</h1>
      </div>
      
      {/* Main Navigation */}
      <div className="bg-gray-100 p-2 flex space-x-2">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`px-4 py-2 rounded ${activeTab === 'chat' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        >
          Chat System
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        >
          Dashboards
        </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' ? (
          <div className="grid grid-cols-4 h-full">
            {/* Chat List */}
            <div className="col-span-1 border-r">
              <div className="p-4">
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Search messages..."
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => setActiveChatType('private')} 
                    className={`px-3 py-1 rounded flex-1 ${activeChatType === 'private' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Private
                  </button>
                  <button 
                    onClick={() => setActiveChatType('group')} 
                    className={`px-3 py-1 rounded flex-1 ${activeChatType === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Groups
                  </button>
                </div>
                
                <div className="space-y-2">
                  {filteredChats.map(chat => (
                    <div 
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className={`p-3 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center ${selectedChat?.id === chat.id ? 'bg-blue-50 border border-blue-200' : ''}`}
                    >
                      <div>
                        <div className="font-medium">{chat.name}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content.substring(0, 20) + '...' : 'No messages'}
                        </div>
                      </div>
                      {chat.unread > 0 && (
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chat Details */}
            <div className="col-span-3 flex flex-col h-full">
              {selectedChat ? (
                <>
                  <div className="border-b p-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium">{selectedChat.name}</h2>
                      <div className="text-sm text-gray-500">
                        {selectedChat.type === 'private' ? 'Private conversation' : 'Group chat • 5 members'}
                      </div>
                    </div>
                    <div>
                      <button className="mr-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Schedule Meeting
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Room Allocation
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {selectedChat.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs rounded-lg p-3 ${
                          msg.sender === 'Me' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200'
                        } ${
                          msg.priority === 'high' 
                            ? 'border-2 border-red-500' 
                            : msg.priority === 'medium'
                              ? 'border-2 border-yellow-500'
                              : ''
                        } ${
                          msg.tagged ? 'border-l-4 border-l-green-500' : ''
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-sm">
                              {msg.sender}
                            </div>
                            <div className="text-xs">
                              {msg.time}
                            </div>
                          </div>
                          <div>{msg.content}</div>
                          
                          {msg.sender !== 'Me' && (
                            <div className="mt-2 flex justify-end space-x-1">
                              <button 
                                onClick={() => setPriority(selectedChat.id, msg.id, 'normal')}
                                className="text-xs px-2 py-1 rounded bg-gray-300 hover:bg-gray-400"
                              >
                                Normal
                              </button>
                              <button 
                                onClick={() => setPriority(selectedChat.id, msg.id, 'medium')}
                                className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300"
                              >
                                Medium
                              </button>
                              <button 
                                onClick={() => setPriority(selectedChat.id, msg.id, 'high')}
                                className="text-xs px-2 py-1 rounded bg-red-200 hover:bg-red-300"
                              >
                                High
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => setActiveMetric('pending')}
                className={`px-4 py-2 rounded ${activeMetric === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Pending Tasks
              </button>
              <button 
                onClick={() => setActiveMetric('performance')}
                className={`px-4 py-2 rounded ${activeMetric === 'performance' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Performance
              </button>
              <button 
                onClick={() => setActiveMetric('completed')}
                className={`px-4 py-2 rounded ${activeMetric === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Completed Work
              </button>
              <button 
                onClick={() => setActiveMetric('notifications')}
                className={`px-4 py-2 rounded ${activeMetric === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Notifications
              </button>
              <button 
                onClick={() => setActiveMetric('workload')}
                className={`px-4 py-2 rounded ${activeMetric === 'workload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Workload
              </button>
              <button 
                onClick={() => setActiveMetric('projects')}
                className={`px-4 py-2 rounded ${activeMetric === 'projects' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Project Success
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              {activeMetric === 'pending' && renderPendingTasksChart()}
              {activeMetric === 'performance' && renderPerformanceChart()}
              {activeMetric === 'completed' && renderCompletedWorkChart()}
              {activeMetric === 'notifications' && renderNotificationsChart()}
              {activeMetric === 'workload' && renderWorkloadHeatmap()}
              {activeMetric === 'projects' && renderProjectSuccessChart()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboardPrototype;
