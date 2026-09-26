import React, { useEffect, useMemo, useState } from 'react';
import siteConfig from '../siteConfig';
import Modal from './ui/Modal';
import FaceSearchCard from './FaceSearchCard';

const prettyCategory = (category) => {
  if (category === 'our-moments') return 'Our Photos';
  if (category === 'uploaded') return 'Guest Photos';
  return category || 'Other';
};

function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      const allPhotos = (siteConfig.photoGallery?.staticPhotos || []).map((url, index) => ({
        id: `our-${index}`,
        url,
        thumbnailUrl: url,
        date: new Date().toISOString(),
        category: 'our-moments',
      }));

      if (siteConfig.photoGallery?.showUploadedPhotos) {
        try {
          const response = await fetch('/.netlify/functions/get-photos');
          const data = await response.json();
          if (data.success && data.photos) allPhotos.push(...data.photos);
        } catch (error) {
          console.warn('Guest photos could not be loaded:', error);
        }
      }

      setPhotos(allPhotos);
      setLoading(false);
    }
    loadPhotos();
  }, []);

  const categories = useMemo(() => ['all', ...new Set(photos.map((p) => p.category).filter(Boolean))], [photos]);
  const filteredPhotos = filter === 'all' ? photos : photos.filter((photo) => photo.category === filter);

  return (
    <main className="min-h-screen wedding-surface pt-28 pb-20">
      <div className="section-container">
        <div className="text-center mb-10">
          <p className="eyebrow">Our photos + guest moments</p>
          <h1 className="section-title">{siteConfig.photoGallery.title}</h1>
          <p className="section-subtitle">{siteConfig.photoGallery.subtitle}</p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button key={category} onClick={() => setFilter(category)} className={`gallery-filter ${filter === category ? 'gallery-filter-active' : ''}`}>
                {category === 'all' ? 'All Photos' : prettyCategory(category)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-apple-gray-600">Loading memories…</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20"><p className="text-apple-gray-600">No photographs here yet.</p></div>
        ) : (
          <div className="gallery-grid">
            {filteredPhotos.map((photo) => (
              <button key={photo.id} onClick={() => setSelectedPhoto(photo)} className="gallery-tile text-left">
                <img src={photo.thumbnailUrl || photo.url} alt="Wedding memory" loading="lazy" />
                <span className="gallery-tile-label">{prettyCategory(photo.category)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted mb-3">Have photographs from the celebrations? Choose the occasion and share them with us.</p>
          <a href="/upload-photos" className="text-maroon font-semibold hover:underline">Share Your Moments →</a>
        </div>

        <FaceSearchCard />
      </div>

      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title={selectedPhoto ? prettyCategory(selectedPhoto.category) : 'Photo'}>
        {selectedPhoto && (
          <div>
            <img src={selectedPhoto.url} alt="Wedding memory" className="w-full max-h-[70vh] object-contain rounded-xl" />
            {siteConfig.photoGallery.enableDownload && selectedPhoto.downloadUrl && (
              <div className="text-center mt-5">
                <a href={selectedPhoto.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-maroon font-semibold hover:underline">Download Photo</a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
}

export default PhotoGallery;
