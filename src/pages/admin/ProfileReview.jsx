import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { calcAge, formatDate, formatHeight, getErrorMessage, photoUrl } from '../../utils/format.utils';
import { ArrowLeft, CheckCircle, XCircle, FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:'var(--space-6)' }}>
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}
function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display:'flex', gap:'var(--space-4)', padding:'var(--space-2) 0', borderBottom:'1px solid var(--color-border)' }}>
      <span style={{ minWidth:180, color:'var(--color-text-muted)', fontSize:'var(--text-sm)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'var(--text-sm)' }}>{String(value)}</span>
    </div>
  );
}

/**
 * Build an authenticated URL for a document (Gov ID / Kundli).
 * Appends token as query param so <img> / <iframe> / <a> can access admin-protected endpoint.
 */
function documentUrl(docId) {
  const token = localStorage.getItem('token');
  const qs = token ? `?token=${encodeURIComponent(token)}` : '';
  return `/api/v1/files/document/${docId}${qs}`;
}

export default function ProfileReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [reason, setReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    adminApi.profile(id)
      .then((r) => setData(r.data.data))
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVerify = async (action) => {
    setActing(true);
    try {
      await adminApi.verify({ user_id: data.user_id, action, reason: action === 'Rejected' ? reason : undefined });
      toast.success(`Profile ${action} successfully.`);
      setData((d) => ({ ...d, account_status: action }));
      setShowRejectForm(false);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally { setActing(false); }
  };

  if (loading) return <div style={{ textAlign:'center', padding:'var(--space-20)' }}><div className="spinner spinner-lg" style={{ margin:'0 auto' }} /></div>;
  if (!data) return <div style={{ textAlign:'center', color:'var(--color-error)' }}>Profile not found.</div>;

  const age = calcAge(data.date_of_birth);
  const govIdDoc = data.docs?.find((d) => d.doc_type === 'gov_id');
  const govIdUrl = govIdDoc ? documentUrl(govIdDoc.doc_id) : null;
  const isPdf = govIdDoc?.filename?.endsWith('.pdf');

  return (
    <div className="page-enter">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/pending')} style={{ marginBottom:'var(--space-5)' }}>
        <ArrowLeft size={16} /> Back to Pending
      </button>

      {/* Header with actions */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'var(--space-6)', flexWrap:'wrap', gap:'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
            {data.first_name} {data.surname}
          </h1>
          <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginTop:'var(--space-1)' }}>
            {data.email} · Profile ID #{data.profile_id} · Submitted {formatDate(data.user_created)}
          </p>
          <div style={{ marginTop:'var(--space-2)' }}>
            <span className={`badge ${
              data.account_status === 'Approved' ? 'badge-approved' :
              data.account_status === 'Rejected' ? 'badge-rejected' :
              data.account_status === 'Suspended' ? 'badge-suspended' : 'badge-pending'
            }`}>{data.account_status}</span>
          </div>
        </div>

        {data.account_status === 'Pending_ID' && (
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => handleVerify('Approved')} disabled={acting}>
              <CheckCircle size={18} /> Approve Profile
            </button>
            <button className="btn btn-outline btn-lg" style={{ color:'var(--color-error)', borderColor:'var(--color-error)' }}
              onClick={() => setShowRejectForm(!showRejectForm)} disabled={acting}>
              <XCircle size={18} /> Reject
            </button>
          </div>
        )}
      </div>

      {/* Reject reason form */}
      {showRejectForm && (
        <div className="card card-padded" style={{ marginBottom:'var(--space-6)', border:'1.5px solid var(--color-error)' }}>
          <h3 style={{ color:'var(--color-error)', marginBottom:'var(--space-3)' }}>Reason for Rejection</h3>
          <textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a reason (e.g. ID is blurry, ID mismatch, etc.)" style={{ resize:'vertical' }} />
          <div style={{ display:'flex', gap:'var(--space-3)', marginTop:'var(--space-3)' }}>
            <button className="btn btn-primary" style={{ background:'var(--color-error)', borderColor:'var(--color-error)' }}
              onClick={() => handleVerify('Rejected')} disabled={acting || !reason.trim()}>
              Confirm Rejection
            </button>
            <button className="btn btn-ghost" onClick={() => setShowRejectForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Government ID — shown inline ────────────────────────────────── */}
      {govIdUrl && (
        <div className="card card-padded" style={{ marginBottom:'var(--space-6)', border:'1.5px solid var(--color-gold)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
              <FileText size={20} color="var(--color-gold)" />
              <strong>Government ID Document</strong>
              <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-light)' }}>
                (Admin-only · never shown to other users)
              </span>
            </div>
            <a href={govIdUrl} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
              Open Full Size ↗
            </a>
          </div>

          {isPdf ? (
            <iframe
              src={govIdUrl}
              title="Government ID"
              style={{ width:'100%', height:'500px', border:'none', borderRadius:'var(--radius-md)' }}
            />
          ) : (
            <img
              src={govIdUrl}
              alt="Government ID"
              style={{
                maxWidth:'100%', maxHeight:'500px',
                borderRadius:'var(--radius-md)',
                border:'1px solid var(--color-border)',
                display:'block',
              }}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
          )}
          {/* Fallback if image fails to load */}
          <div style={{ display:'none', alignItems:'center', gap:'var(--space-2)', color:'var(--color-error)', fontSize:'var(--text-sm)', marginTop:'var(--space-2)' }}>
            ⚠ Could not load image. <a href={govIdUrl} target="_blank" rel="noreferrer" style={{ color:'var(--color-primary)' }}>Try opening directly ↗</a>
          </div>
        </div>
      )}

      {/* ── Profile Photos ────────────────────────────────────────────────── */}
      {data.photos?.length > 0 && (
        <div className="card card-padded" style={{ marginBottom:'var(--space-6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-4)' }}>
            <Image size={18} color="var(--color-primary)" />
            <strong>Profile Photos ({data.photos.length})</strong>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'var(--space-3)' }}>
            {data.photos.map((p) => (
              <div key={p.photo_id} style={{ position:'relative', aspectRatio:'1', borderRadius:'var(--radius-md)', overflow:'hidden', border:'2px solid var(--color-border)' }}>
                <img
                  src={photoUrl(p.filename)}
                  alt="Profile"
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                />
                {p.is_primary === 1 && (
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.6)', color:'white', fontSize:'10px', textAlign:'center', padding:'3px' }}>
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)' }}>
        <div>
          <Section title="Personal Information">
            <InfoRow label="Full Name" value={`${data.first_name} ${data.surname}`} />
            <InfoRow label="Gender" value={data.gender} />
            <InfoRow label="Age" value={age ? `${age} years` : null} />
            <InfoRow label="Date of Birth" value={formatDate(data.date_of_birth)} />
            <InfoRow label="Marital Status" value={data.marital_status} />
            <InfoRow label="Height" value={formatHeight(data.height_cm)} />
            <InfoRow label="City" value={data.city} />
            <InfoRow label="Dietary Habit" value={data.dietary_habit} />
          </Section>

          <Section title="Education &amp; Profession">
            <InfoRow label="Education" value={data.education} />
            <InfoRow label="Profession" value={data.profession} />
            <InfoRow label="Employer" value={data.employer} />
            <InfoRow label="Annual Income" value={data.annual_income} />
          </Section>
        </div>

        <div>
          <Section title="Lineage">
            <InfoRow label="Sub-Sect" value={data.sub_sect} />
            <InfoRow label="Gotra" value={data.gotra} />
            <InfoRow label="Pravara" value={data.pravara} />
            <InfoRow label="Maternal Gotra" value={data.maternal_gotra} />
            <InfoRow label="Veda" value={data.veda} />
            <InfoRow label="Sect / Shakha" value={data.shakha} />
            <InfoRow label="Native Place" value={data.native_place} />
          </Section>

          <Section title="Family &amp; Elder References (Admin View)">
            <InfoRow label="Father" value={data.family?.father_name} />
            <InfoRow label="Father's Occupation" value={data.family?.father_occupation} />
            <InfoRow label="Mother" value={data.family?.mother_name} />
            <InfoRow label="Mother's Inti Peru" value={data.family?.mother_maiden_inti_peru} />
            <InfoRow label="Siblings" value={data.family?.sibling_count} />
            {/* Elder Reference 1 */}
            <InfoRow label="Elder Ref 1 — Name" value={data.family?.elder_ref_1_name} />
            <InfoRow label="Elder Ref 1 — Phone" value={data.family?.elder_ref_1_phone} />
            <InfoRow label="Elder Ref 1 — Address" value={data.family?.elder_ref_1_address} />
            <InfoRow label="Elder Ref 1 — Occupation" value={data.family?.elder_ref_1_occupation} />
            {/* Elder Reference 2 */}
            <InfoRow label="Elder Ref 2 — Name" value={data.family?.elder_ref_2_name} />
            <InfoRow label="Elder Ref 2 — Phone" value={data.family?.elder_ref_2_phone} />
            <InfoRow label="Elder Ref 2 — Address" value={data.family?.elder_ref_2_address} />
            <InfoRow label="Elder Ref 2 — Occupation" value={data.family?.elder_ref_2_occupation} />
            {/* Elder Reference 3 */}
            <InfoRow label="Elder Ref 3 — Name" value={data.family?.elder_ref_3_name} />
            <InfoRow label="Elder Ref 3 — Phone" value={data.family?.elder_ref_3_phone} />
            <InfoRow label="Elder Ref 3 — Address" value={data.family?.elder_ref_3_address} />
            <InfoRow label="Elder Ref 3 — Occupation" value={data.family?.elder_ref_3_occupation} />
          </Section>
        </div>
      </div>
    </div>
  );
}
