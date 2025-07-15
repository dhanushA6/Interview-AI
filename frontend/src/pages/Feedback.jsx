import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/interviews/${id}`, { withCredentials: true })
      .then(r => {
        setFeedback(r.data.feedback);
        setPoints(r.data.points);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/main")}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 group-hover:-translate-x-1 transition-transform" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Back to History</span>
              </button>
              <h1 className="text-xl font-bold text-white">Interview Feedback</h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {points !== null && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-indigo-100 rounded-full blur-md opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full shadow-lg border-4 border-white">
                    <div className="text-center">
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1">Your Score</div>
                      <div className="text-3xl font-bold">
                        {points}<span className="text-xl opacity-80">/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : feedback ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-800">Detailed Feedback</h2>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {feedback}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">No feedback available</h3>
                <p className="mt-1 text-gray-500">This interview doesn't have feedback yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}