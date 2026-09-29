// Face matching that runs entirely inside the guest's phone (nothing is sent anywhere).
// It uses the open-source face-api library, copied into /public/vendor and /public/models.

let loading = null;

function addScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('face library failed to load'));
    document.head.appendChild(s);
  });
}

export function loadFaceApi() {
  if (!loading) {
    loading = (async () => {
      await addScript('/vendor/face-api.js');
      const fa = window.faceapi;
      if (!fa) throw new Error('face library missing');
      await fa.tf.ready();
      await Promise.all([
        fa.nets.ssdMobilenetv1.loadFromUri('/models'),
        fa.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        fa.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      return fa;
    })().catch((e) => { loading = null; throw e; });
  }
  return loading;
}

// Returns a list of faces found: [{ descriptor: number[128], area }]
export async function describeFaces(canvas, { minConfidence = 0.5 } = {}) {
  const fa = await loadFaceApi();
  const options = new fa.SsdMobilenetv1Options({ minConfidence });
  const results = await fa.detectAllFaces(canvas, options).withFaceLandmarks(true).withFaceDescriptors();
  return results
    .map((r) => ({ descriptor: Array.from(r.descriptor), area: r.detection.box.width * r.detection.box.height }))
    .sort((a, b) => b.area - a.area);
}

export function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) { const d = a[i] - b[i]; sum += d * d; }
  return Math.sqrt(sum);
}

// A photo matches if any face in it is close enough to the selfie.
// (tested: the same person scores about 0.35–0.57, different people 0.75 or more)
export const MATCH_DISTANCE = 0.6;

export function matchPhotos(selfieDescriptor, faceRecords) {
  const matches = new Map();
  faceRecords.forEach((rec) => {
    let best = Infinity;
    (rec.d || []).forEach((d) => { best = Math.min(best, distance(selfieDescriptor, d)); });
    if (best <= MATCH_DISTANCE) matches.set(rec.id, best);
  });
  return matches;
}
