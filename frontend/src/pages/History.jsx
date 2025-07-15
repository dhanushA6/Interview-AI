import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/interviews/${id}`, { withCredentials: true })
      .then(r => setHistoryData(r.data));
  }, [id]);

  if (!historyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading interview data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <h2 className="text-xl font-bold text-white">{historyData.title}</h2>
              <div className="w-5"></div> {/* Spacer for balance */}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 h-[500px] overflow-y-auto space-y-4">
            {historyData.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'ai' 
                    ? 'bg-indigo-50 text-gray-800 rounded-tl-none' 
                    : 'bg-purple-600 text-white rounded-tr-none'}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${msg.role === 'ai' ? 'text-indigo-600' : 'text-purple-200'}`}>
                    {msg.role === 'ai' ? 'Interview AI' : 'You'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Section */}
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Interview Feedback</h3>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">
                {historyData.feedback || 'No feedback provided for this interview.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}