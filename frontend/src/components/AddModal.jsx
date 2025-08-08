import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddModal({ close, onSaved }) {
  const [form, setForm] = useState({ title:'', description:'', experienceYears:'', resumeId: '' });
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/resumes', { withCredentials: true })
      .then(res => setResumes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setResumes([]));
  }, []);

  const save = () => { 
    axios.post('http://localhost:3000/api/interviews', {
      ...form,
      experienceYears: Number(form.experienceYears),
      resumeId: form.resumeId
    }, { withCredentials: true }).then(r => { onSaved(r.data); close(); });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">New Interview</h3>
        {['title','description','experienceYears'].map(k=>(
          <input key={k}
            placeholder={k.replace(/([A-Z])/g,' $1')}
            value={form[k]}
            onChange={e=>setForm({...form,[k]:e.target.value})}
            className="w-full border p-3 rounded-md text-base mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        ))}
        <select
          value={form.resumeId}
          onChange={e => setForm({ ...form, resumeId: e.target.value })}
          className="w-full border p-3 rounded-md text-base mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select Resume (optional)</option>
          {(Array.isArray(resumes) ? resumes : []).map(r => (
            <option key={r._id} value={r._id}>{r.originalName}</option>
          ))}
        </select>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md font-semibold">Cancel</button>
          <button onClick={save} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-bold shadow">Save</button>
        </div>
      </div>
    </div>
  );
}
