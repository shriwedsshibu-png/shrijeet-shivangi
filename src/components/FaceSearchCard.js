import React from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';

function FaceSearchCard() {
  const url = siteConfig.travel?.photographerGalleryUrl;
  return (
    <Card className="p-6 sm:p-8 text-center max-w-3xl mx-auto mt-12">
      <p className="eyebrow">Professional wedding gallery</p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">Find your photographs</h2>
      <p className="text-muted mt-3 max-w-2xl mx-auto">After the wedding, we will add our photographer's face-search gallery here. Use that separate gallery to scan/search for your face, find photographs in which you appear, and download them easily.</p>
      {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block mt-6"><Button variant="primary">Find My Photos</Button></a> : <p className="mt-5 text-sm text-muted italic">Photographer's face-search link will be added after the wedding.</p>}
    </Card>
  );
}

export default FaceSearchCard;
