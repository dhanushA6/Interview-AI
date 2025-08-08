import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResumeManager({ open, onClose }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (open) fetchResumes();
  }, [open]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/resumes', { withCredentials: true });
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setResumes([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/resumes/${id}`, { withCredentials: true });
    setResumes(resumes => resumes.filter(r => r._id !== id));
    setConfirmDelete(null);
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:3000/api/resumes/download/${id}`, '_blank');
  };

  const handleRename = async (id) => {
    if (!renameValue.trim()) return;
  
    let newName = renameValue.trim();
    if (!newName.toLowerCase().endsWith('.pdf')) {
      newName += '.pdf';
    }
  
    await axios.patch(
      `http://localhost:3000/api/resumes/rename/${id}`,
      { newName },
      { withCredentials: true }
    );
  
    setRenameId(null);
    setRenameValue('');
    fetchResumes();
  };
  

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">My Resumes</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y max-h-80 overflow-y-auto">
            {resumes.map(r => (
              <li key={r._id} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  {renameId === r._id ? (
                    <div className="flex gap-2">
                      <input
                        className="border p-1 rounded"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="text-green-600 font-bold"
                        onClick={() => handleRename(r._id)}
                      >Save</button>
                      <button
                        className="text-gray-500"
                        onClick={() => { setRenameId(null); setRenameValue(''); }}
                      >Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{r.originalName}</span>
                      <span className="block text-xs text-gray-500">{new Date(r.uploadDate).toLocaleString()}</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2 items-center ml-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Download"
                    onClick={() => handleDownload(r._id)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Rename"
                    onClick={() => { setRenameId(r._id); setRenameValue(r.originalName); }}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 00-4-4L5 17v4z" />
                    </svg>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                    onClick={() => setConfirmDelete(r._id)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Delete confirmation modal */}
                {confirmDelete === r._id && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl text-center">
                      <h3 className="text-lg font-bold mb-4">Delete Resume?</h3>
                      <p className="mb-4">Are you sure you want to delete this resume? This action cannot be undone.</p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
            {resumes.length === 0 && <li className="text-gray-500 text-center py-8">No resumes uploaded yet.</li>}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md font-semibold">Close</button>
        </div>
      </div>
    </div>
  );
} 