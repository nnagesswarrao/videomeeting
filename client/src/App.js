import React, { useState } from 'react';
import VideoChat from './components/VideoChat';
import CreateMeeting from './components/CreateMeeting';

function App() {
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  const handleMeetingCreate = (meetingData) => {
    console.log('Meeting created:', meetingData);
    // Here you would typically send this to your backend
    setShowCreateMeeting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Video Meeting App</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateMeeting(!showCreateMeeting)}
            >
              {showCreateMeeting ? 'Back to Video Chat' : 'Schedule Meeting'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showCreateMeeting ? (
          <CreateMeeting onMeetingCreate={handleMeetingCreate} />
        ) : (
          <VideoChat />
        )}
      </main>
    </div>
  );
}

export default App;
