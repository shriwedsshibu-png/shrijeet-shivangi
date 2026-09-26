import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';

function timeToMinutes(time) {
  const match = String(time || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

function UploadPhotos() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  const events = useMemo(() => [...(siteConfig.events?.events || [])].sort((a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time)), []);

  const addFiles = (selectedFiles) => {
    const maxSize = (siteConfig.uploadPhotos?.maxFileSize || 10) * 1024 * 1024;
    const allowedTypes = siteConfig.uploadPhotos?.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setMessage(`${file.name} is not a supported image type.`);
        return false;
      }
      if (file.size > maxSize) {
        setMessage(`${file.name} is too large. Maximum size is ${siteConfig.uploadPhotos?.maxFileSize || 10}MB.`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...validFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    if (validFiles.length) setMessage('');
  };

  const handleUpload = async () => {
    if (!category) {
      setMessage('Please choose the celebration first.');
      return;
    }
    if (!files.length) {
      setMessage('Please choose at least one photograph.');
      return;
    }

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('category', category);
    files.forEach((file) => formData.append('images', file));

    try {
      const response = await fetch('/.netlify/functions/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Upload failed.');
      previews.forEach((item) => URL.revokeObjectURL(item.preview));
      setMessage('Your photographs have been added to our wedding memories. ❤️');
      setFiles([]);
      setPreviews([]);
      setCategory('');
      setTimeout(() => navigate('/gallery'), 1600);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-12">
          <p className="eyebrow">Scan · Choose · Share</p>
          <h1 className="section-title">{siteConfig.uploadPhotos.title}</h1>
          <p className="section-subtitle">{siteConfig.uploadPhotos.subtitle}</p>
        </div>

        <Card className="p-7 md:p-10">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-apple-gray-800 mb-2">Which celebration?</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-apple" disabled={uploading}>
              <option value="">Select a celebration</option>
              {events.map((event) => <option key={event.id} value={event.name}>{event.name}</option>)}
            </select>
          </div>

          <div
            className="upload-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          >
            <div className="text-5xl mb-4">📸</div>
            <h2 className="font-display text-2xl font-semibold text-apple-gray-900">Choose your photographs</h2>
            <p className="text-apple-gray-600 mt-2 mb-5">You can select multiple photographs at once.</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => addFiles(e.target.files)} className="hidden" />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>Choose Photos</Button>
            <p className="text-xs text-apple-gray-500 mt-4">JPEG, PNG or WebP · up to {siteConfig.uploadPhotos.maxFileSize}MB each</p>
          </div>

          {previews.length > 0 && (
            <div className="mt-8">
              <p className="font-semibold text-apple-gray-900 mb-4">Selected: {previews.length} photo{previews.length > 1 ? 's' : ''}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {previews.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="relative group rounded-xl overflow-hidden aspect-square bg-apple-gray-100">
                    <img src={item.preview} alt="Selected preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { URL.revokeObjectURL(item.preview); setFiles((prev) => prev.filter((_, i) => i !== index)); setPreviews((prev) => prev.filter((_, i) => i !== index)); }} className="absolute top-2 right-2 bg-maroon text-white rounded-full w-7 h-7">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="primary" size="lg" onClick={handleUpload} disabled={uploading || !files.length}>
              {uploading ? 'Uploading…' : `Upload ${files.length || ''} Photo${files.length === 1 ? '' : 's'}`}
            </Button>
          </div>

          {message && <div className="mt-6 p-4 rounded-xl bg-ivory-dark text-maroon text-center">{message}</div>}
        </Card>

        <div className="text-center mt-8"><Link to="/gallery" className="text-maroon font-medium hover:underline">View the Gallery →</Link></div>
      </div>
    </main>
  );
}

export default UploadPhotos;
