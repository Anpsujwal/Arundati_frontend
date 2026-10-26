import { useState, useEffect } from 'react';
import { Upload, X, FileText, ImageIcon } from 'lucide-react';
import { profileApi } from '../../../api/profile.api';
import { getErrorMessage, photoUrl } from '../../../utils/format.utils';
import toast from 'react-hot-toast';

export default function Step6Photos({ onComplete, onBack }) {
  const [photos, setPhotos] = useState([]); // { file, preview, id, uploaded }
  const [kundliFile, setKundliFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    profileApi.me().then((r) => {
      const existingPhotos = r.data.data?.photos || [];
      if (existingPhotos.length > 0) {
        setPhotos(existingPhotos.map((p) => ({
          id: p.photo_id,
          preview: photoUrl(p.filename),
          uploaded: true,
          is_primary: p.is_primary === 1,
        })));
      }
    }).catch(() => {});
  }, []);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }));
    setPhotos((p) => [...p, ...toAdd]);
    setError('');
  };

  const removePhoto = async (idx) => {
    const photoToRemove = photos[idx];
    if (photoToRemove.uploaded && photoToRemove.id) {
      try {
        await profileApi.deletePhoto(photoToRemove.id);
        toast.success('Photo removed');
      } catch (err) {
        toast.error('Could not delete photo from server');
      }
    }
    setPhotos((p) => p.filter((_, i) => i !== idx));
  };

  const handleComplete = async () => {
    if (photos.length === 0) {
      setError('At least 1 profile photo is required.');
      toast.error('Please upload at least 1 profile photo before proceeding.');
      return;
    }
    setLoading(true);
    try {
      // Upload any new photos
      for (const p of photos.filter((p) => !p.uploaded)) {
        await profileApi.uploadPhoto(p.file);
      }
      // Upload kundli if provided
      if (kundliFile) {
        await profileApi.uploadDocument(kundliFile, 'kundli_pdf');
      }
      toast.success('Photos saved!');
      onComplete(); // advances to Step 7
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="section-title">Step 6 — Photos &amp; Horoscope</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Upload your profile photos and optionally your Kundli PDF. At least 1 profile photo is <span className="required">* mandatory</span>.
      </p>

      {/* Photo upload */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <label className="input-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>
          Profile Photos (Up to 5) <span className="required">*</span>
        </label>

        {photos.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 'var(--space-3)', marginBottom: 'var(--space-4)',
          }}>
            {photos.map((p, idx) => (
              <div key={idx} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1', border: '1px solid var(--color-border)' }}>
                <img src={p.preview} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {idx === 0 && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    fontSize: '10px', textAlign: 'center', padding: '3px',
                  }}>Primary</div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'rgba(0,0,0,0.6)', border: 'none',
                    borderRadius: '50%', cursor: 'pointer', color: 'white',
                    display: 'flex', padding: '3px',
                  }}
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 5 && (
          <div
            style={{
              border: `2px dashed ${error ? 'var(--color-error)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)',
              padding: 'var(--space-8)', textAlign: 'center', cursor: 'pointer',
              background: 'var(--color-surface-2)', transition: 'all var(--transition-fast)',
            }}
            onClick={() => document.getElementById('photo-input').click()}
          >
            <ImageIcon size={32} color={error ? 'var(--color-error)' : 'var(--color-text-light)'} style={{ margin: '0 auto var(--space-2)' }} />
            <p style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Click to add photos <span className="required">*</span></p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-1)' }}>
              JPG, PNG, WebP · Max 5 MB each · Up to {5 - photos.length} more
            </p>
            <input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp"
              multiple style={{ display:'none' }} onChange={handlePhotoSelect} />
          </div>
        )}
        {error && <p className="input-error-msg" style={{ marginTop: 'var(--space-2)' }}>{error}</p>}
      </div>

      {/* Kundli PDF */}
      <div>
        <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
          Kundli / Horoscope PDF <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>(Optional)</span>
        </label>
        <div
          style={{
            border: `2px dashed ${kundliFile ? 'var(--color-gold)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)', padding: 'var(--space-6)',
            textAlign: 'center', cursor: 'pointer', background: kundliFile ? 'var(--color-gold-faint)' : 'var(--color-surface-2)',
          }}
          onClick={() => document.getElementById('kundli-input').click()}
        >
          <FileText size={28} color={kundliFile ? 'var(--color-gold)' : 'var(--color-text-light)'} style={{ margin: '0 auto var(--space-2)' }} />
          {kundliFile ? (
            <p style={{ color: 'var(--color-gold)', fontWeight: 500 }}>✓ {kundliFile.name}</p>
          ) : (
            <>
              <p style={{ fontWeight:500, color:'var(--color-text-muted)' }}>Upload Kundli PDF</p>
              <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-light)', marginTop:'var(--space-1)' }}>
                PDF only · Max 10 MB
              </p>
            </>
          )}
          <input id="kundli-input" type="file" accept="application/pdf"
            style={{ display:'none' }} onChange={(e) => setKundliFile(e.target.files[0] || null)} />
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'var(--space-8)' }}>
        <button type="button" className="btn btn-ghost btn-lg" onClick={onBack}>← Back</button>
        <button id="step6-submit" type="button" className="btn btn-primary btn-lg" onClick={handleComplete} disabled={loading}>
          {loading ? <span className="spinner spinner-sm" style={{ borderTopColor:'white' }} /> : null}
          {loading ? 'Saving…' : 'Continue to Preferences →'}
        </button>
      </div>
    </div>
  );
}
