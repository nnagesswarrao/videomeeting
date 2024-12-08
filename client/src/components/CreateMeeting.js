import React, { useState } from 'react';
import { format } from 'date-fns';

const CreateMeeting = ({ onMeetingCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        startDateTime: '',
        endDateTime: '',
        agenda: '',
        participants: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const participants = formData.participants
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '');

        const meetingData = {
            ...formData,
            participants,
            createdAt: new Date().toISOString()
        };

        onMeetingCreate(meetingData);
        setFormData({
            title: '',
            startDateTime: '',
            endDateTime: '',
            agenda: '',
            participants: ''
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Meeting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="Enter meeting title"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            id="startDateTime"
                            name="startDateTime"
                            value={formData.startDateTime}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            id="endDateTime"
                            name="endDateTime"
                            value={formData.endDateTime}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                        Agenda
                    </label>
                    <textarea
                        id="agenda"
                        name="agenda"
                        value={formData.agenda}
                        onChange={handleChange}
                        rows="3"
                        className="input"
                        placeholder="Enter meeting agenda"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                        Participants (comma-separated emails)
                    </label>
                    <input
                        type="text"
                        id="participants"
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        className="input"
                        placeholder="participant1@email.com, participant2@email.com"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Create Meeting
                </button>
            </form>
        </div>
    );
};

export default CreateMeeting;
