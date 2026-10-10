// Face matching that runs entirely inside the guest's phone (nothing is sent anywhere).
// It uses the open-source face-api library, copied into /public/vendor and /public/models.
//
// Speed: "Find my photos" only needs the small face finder (0.2 MB) + the face reader (6 MB).
// The bigger group-photo finder (5.6 MB) is fetched only when someone uploads photos,
// or as a fallback if a selfie is hard to read.

let core = null;
let ssd = null;

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

// library + small face finder + face reader, then one tiny practice run so the phone's
// graphics chip has its programs ready before the guest's selfie arrives
function loadCore() {
  if (!core) {
    core = (async () => {
      await addScript('/vendor/face-api.js');
      const fa = window.faceapi;
      if (!fa) throw new Error('face library missing');
      await fa.tf.ready();
      await Promise.all([
        fa.nets.tinyFaceDetector.loadFromUri('/models'),
        fa.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        fa.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      try {
        const c = document.createElement('canvas'); c.width = 128; c.height = 128;
        c.getContext('2d').fillRect(0, 0, 128, 128);
        await fa.detectAllFaces(c, new fa.TinyFaceDetectorOptions({ inputSize: 160 }));
        await fa.computeFaceDescriptor(c);
      } catch (e) { /* the warm-up is only a nicety */ }
      return fa;
    })().catch((e) => { core = null; throw e; });
  }
  return core;
}

function loadSsd() {
  if (!ssd) {
    ssd = loadCore().then((fa) => fa.nets.ssdMobilenetv1.loadFromUri('/models').then(() => fa))
      .catch((e) => { ssd = null; throw e; });
  }
  return ssd;
}

// everything (used when uploading group photos)
export const loadFaceApi = () => loadSsd();

// Start getting the face finder ready in the background (skipped on "data saver" / very slow connections)
export function preloadFaceFinder() {
  try {
    const c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
  } catch (e) { /* ignore */ }
  loadCore().catch(() => {});
}

const shape = (results) => results
  .map((r) => ({ descriptor: Array.from(r.descriptor), area: r.detection.box.width * r.detection.box.height }))
  .sort((a, b) => b.area - a.area);

// Returns a list of faces found: [{ descriptor: number[128], area }]  (group photos: thorough finder)
export async function describeFaces(canvas, { minConfidence = 0.5 } = {}) {
  const fa = await loadSsd();
  const options = new fa.SsdMobilenetv1Options({ minConfidence });
  return shape(await fa.detectAllFaces(canvas, options).withFaceLandmarks(true).withFaceDescriptors());
}

// A selfie: the quick finder first; only if it sees nothing, try the thorough one
export async function describeSelfie(canvas) {
  const fa = await loadCore();
  for (const inputSize of [416, 608]) {
    const found = shape(await fa.detectAllFaces(canvas, new fa.TinyFaceDetectorOptions({ inputSize, scoreThreshold: 0.35 })).withFaceLandmarks(true).withFaceDescriptors());
    if (found.length) return found;
  }
  return describeFaces(canvas, { minConfidence: 0.4 });
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
