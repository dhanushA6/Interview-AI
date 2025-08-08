import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AddModal from '../components/AddModal';
import InterviewCard from '../components/InterviewCard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ResumeUpload from '../components/ResumeUpload';
import ResumeManager from '../components/ResumeManager';

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeManagerOpen, setResumeManagerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/interviews', { withCredentials: true })
      .then((r) => setList(r.data))
      .catch((err) => {
        console.error('Error fetching interviews:', err.response?.data || err.message);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const onSaved = (doc) => setList([doc, ...list]);
  const handleDeleted = (id) => setList(list => list.filter(i => i._id !== id));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Interview Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setResumeManagerOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              My Resumes
            </button>
            <button
              onClick={() => setResumeModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Resume
            </button>
            <button
              onClick={() => navigate('/scores')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Scores
            </button>
            
            {/* Profile dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {user?.name ? user.name[0].toUpperCase() : '?'}
                </div>
                <span className="sr-only">Open user menu</span>
              </button>

              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Welcome back,</span>
            <span className="block text-indigo-600">{user?.name || 'Interviewer'}</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Prepare for your next interview with our AI-powered mock interviews
          </p>
        </div>

        {/* Add new interview card */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setOpen(true)}
            className="w-full max-w-md h-40 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-white p-6 text-center hover:shadow-md transition-all duration-200"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">New Mock Interview</h3>
            <p className="mt-1 text-sm text-gray-500">Click to create a new interview session</p>
          </button>
        </div>

        {/* Previous interviews */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Previous Interviews</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {list.length} {list.length === 1 ? 'session' : 'sessions'}
            </span>
          </div>

          {list.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {list.map(i => <InterviewCard key={i._id} data={i} onDeleted={handleDeleted} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new mock interview.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {open && <AddModal close={() => setOpen(false)} onSaved={onSaved} />}
      <ResumeUpload open={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
      <ResumeManager open={resumeManagerOpen} onClose={() => setResumeManagerOpen(false)} />
    </div>
  );
}