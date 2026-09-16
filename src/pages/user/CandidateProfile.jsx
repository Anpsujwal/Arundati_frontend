import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchesApi } from '../../api/matches.api';
import { interestsApi } from '../../api/matches.api';
import { calcAge, formatHeight, photoUrl, formatDate, getErrorMessage } from '../../utils/format.utils';
import { ArrowLeft, MapPin, Heart, BookOpen, GraduationCap, Users, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:'var(--space-8)' }}>
      <h2 className="section-title">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', gap:'var(--space-4)', padding:'var(--space-3) 0', borderBottom:'1px solid var(--color-border)' }}>
      <span style={{ minWidth:160, color:'var(--color-text-muted)', fontSize:'var(--text-sm)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'var(--text-sm)', color:'var(--color-text)' }}>{value}</span>
    </div>
  );
}

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);

  useEffect(() => {
    matchesApi.profile(id)
      .then((res) => {
        setData(res.data.data);
        setInterestStatus(res.data.data.interest_status);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendInterest = async () => {
    setSending(true);
    try {
      await interestsApi.send(parseInt(id, 10));
      setInterestStatus('Pending');
      toast.success('Interest sent successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setSending(false); }
  };

  if (loading) return (
    <div style={{ textAlign:'center', padding:'var(--space-20)' }}>
      <div className="spinner spinner-lg" style={{ margin:'0 auto' }} />
    </div>
  );

  if (error) return (
    <div style={{ textAlign:'center', padding:'var(--space-20)' }}>
      <div style={{ fontSize:'48px', marginBottom:'var(--space-4)' }}>🚫</div>
      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-2xl)', marginBottom:'var(--space-2)' }}>{error}</h3>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  const age = calcAge(data.date_of_birth);
  const primaryPhoto = data.photos?.find((p) => p.is_primary);

  return (
    <div className="page-enter">
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:'var(--space-5)' }}>
        <ArrowLeft size={16} /> Back to Matches
      </button>

      {/* Hero card */}
      <div className="card" style={{ marginBottom:'var(--space-6)', overflow:'hidden' }}>
        <div style={{ display:'flex', gap:'var(--space-8)', padding:'var(--space-6)', flexWrap:'wrap' }}>
          {/* Avatar */}
          <div style={{ flexShrink:0 }}>
            <div style={{
              width:'140px', height:'140px', borderRadius:'var(--radius-xl)',
              overflow:'hidden', border:'3px solid var(--color-border)',
              background:'var(--color-surface-2)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {primaryPhoto ? (
                <img src={photoUrl(primaryPhoto.filename)} alt={data.first_name}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              ) : (
                <span style={{ fontSize:'64px' }}>{data.gender === 'Female' ? '👩' : '👨'}</span>
              )}
            </div>
          </div>

          {/* Name + quick stats */}
          <div style={{ flex:1, minWidth:'200px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', flexWrap:'wrap', marginBottom:'var(--space-2)' }}>
              <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-text)' }}>
                {data.first_name} {data.surname}
              </h1>
              <span className="badge badge-approved">✓ Verified</span>
            </div>

            <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-4)', color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginBottom:'var(--space-4)' }}>
              {age && <span>🎂 {age} years</span>}
              {data.height_cm && <span>📏 {formatHeight(data.height_cm)}</span>}
              {data.city && <span><MapPin size={13} style={{ display:'inline', verticalAlign:'middle' }} /> {data.city}</span>}
              {data.marital_status && <span>💍 {data.marital_status}</span>}
            </div>

            <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
              {data.gotra && <span className="badge badge-gold">Gotra: {data.gotra}</span>}
              {data.sub_sect && <span className="badge badge-primary">{data.sub_sect}</span>}
              {data.dietary_habit && <span className="badge" style={{ background:'var(--color-success-bg)', color:'var(--color-success)' }}>🌿 {data.dietary_habit}</span>}
            </div>
          </div>

          {/* Interest button */}
          <div style={{ display:'flex', alignItems:'flex-start', flexShrink:0 }}>
            {interestStatus === 'Pending' ? (
              <div className="badge badge-pending" style={{ padding:'var(--space-3) var(--space-4)', fontSize:'var(--text-sm)' }}>
                ⏳ Interest Sent
              </div>
            ) : interestStatus === 'Accepted' ? (
              <div className="badge badge-approved" style={{ padding:'var(--space-3) var(--space-4)', fontSize:'var(--text-sm)' }}>
                ✓ Interest Accepted
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleSendInterest} disabled={sending}>
                <Heart size={18} />
                {sending ? 'Sending…' : 'Express Interest'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)' }}>
        {/* Left column */}
        <div>
          <Section title="🔱 Lineage & Heritage">
            <InfoRow label="Sub-Sect" value={data.sub_sect} />
            <InfoRow label="Gotra" value={data.gotra} />
            <InfoRow label="Pravara" value={data.pravara} />
            <InfoRow label="Maternal Gotra" value={data.maternal_gotra} />
            <InfoRow label="Maternal Inti Peru" value={data.maternal_inti_peru} />
            <InfoRow label="Veda" value={data.veda} />
            <InfoRow label="Sect / Shakha" value={data.shakha} />
            <InfoRow label="Native Place" value={data.native_place} />
          </Section>

          <Section title="👨‍💼 Education & Career">
            <InfoRow label="Education" value={data.education} />
            <InfoRow label="Profession" value={data.profession} />
            <InfoRow label="Employer" value={data.employer} />
            <InfoRow label="Annual Income" value={data.annual_income || 'Not disclosed'} />
          </Section>
        </div>

        {/* Right column */}
        <div>
          <Section title="👨‍👩‍👦 Family">
            <InfoRow label="Father" value={data.family?.father_name} />
            <InfoRow label="Father's Occupation" value={data.family?.father_occupation} />
            <InfoRow label="Mother" value={data.family?.mother_name} />
            <InfoRow label="Siblings" value={data.family?.sibling_count != null ? String(data.family.sibling_count) : null} />
            {/* Elder references — phones stripped by backend for public view */}
            <InfoRow label="Elder Reference 1" value={data.family?.elder_ref_1_name} />
            <InfoRow label="Elder Reference 2" value={data.family?.elder_ref_2_name} />
            <InfoRow label="Elder Reference 3" value={data.family?.elder_ref_3_name} />

            {/* Private phone notice */}
            <div style={{
              marginTop:'var(--space-3)',
              display:'flex', alignItems:'center', gap:'var(--space-2)',
              color:'var(--color-text-light)', fontSize:'var(--text-xs)',
            }}>
              <Lock size={12} /> Contact details shared after mutual interest acceptance
            </div>
          </Section>

          {/* Photos grid */}
          {data.photos && data.photos.length > 0 && (
            <Section title="📸 Photos">
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'var(--space-2)' }}>
                {data.photos.map((p) => (
                  <div key={p.photo_id} style={{ aspectRatio:'1', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
                    <img src={photoUrl(p.filename)} alt="Profile"
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
