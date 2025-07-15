import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function InterviewCard({ data }) {
  const navigate = useNavigate();
  
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-3 min-h-[220px] transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
          {data.title}
        </h3>
        {data.feedback && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Feedback ready
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">{data.experienceYears} Years of Experience</p>
      </div>
      
      <div className="flex items-center gap-2 text-gray-400 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs">Created {dayjs(data.createdAt).format('MMM D, YYYY')}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-auto pt-3">
        <button 
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center gap-1"
          onClick={() => navigate(`/interview/${data._id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start
        </button>
        
        {data.feedback && (
          <button 
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center gap-1"
            onClick={() => navigate(`/feedback/${data._id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Feedback
          </button>
        )}
        
        <button 
          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center gap-1"
          onClick={() => navigate(`/history/${data._id}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
      </div>
    </div>
  );
}