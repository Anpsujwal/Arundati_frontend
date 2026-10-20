import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { formatDate } from '../../utils/format.utils';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

export default function PendingVerification() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.pending().then((r) => setProfiles(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign:'center', padding:'var(--space-20)' }}><div className="spinner spinner-lg" style={{ margin:'0 auto' }} /></div>;

  return (
    <div className="page-enter">
      <div style={{ marginBottom:'var(--space-4)' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
          Pending Verification
        </h1>
        <p style={{ color:'var(--color-text-muted)', marginTop:'var(--space-1)' }}>
          {profiles.length} profile{profiles.length !== 1 ? 's' : ''} awaiting Government ID review
        </p>
        <WeddingDivider size="sm" style={{ margin: 'var(--space-3) 0' }} />
      </div>

      {profiles.length === 0 ? (
        <div style={{ textAlign:'center', padding:'var(--space-20)', color:'var(--color-text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'var(--space-4)' }}>✅</div>
          <h3 style={{ fontFamily:'var(--font-heading)' }}>All caught up!</h3>
          <p>No profiles pending verification.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
          {profiles.map((p) => (
            <div key={p.user_id} className="card" style={{ display:'flex', alignItems:'center', gap:'var(--space-4)', padding:'clamp(var(--space-3), 3vw, var(--space-5))', flexWrap:'wrap' }}>
              {/* Avatar placeholder */}
              <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--color-surface-2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>
                {p.gender === 'Female' ? '👩' : '👨'}
              </div>

              <div style={{ flex:1, minWidth:'180px' }}>
                <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', fontWeight:600 }}>
                  {p.first_name ? `${p.first_name} ${p.surname}` : '(Incomplete profile)'}
                </div>
                <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-1)' }}>
                  {p.email} · {p.gender || 'Gender not set'} · Gotra: {p.gotra || 'Not set'}
                </div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-light)', marginTop:'var(--space-1)' }}>
                  Submitted: {formatDate(p.created_at)}
                  {' · '} Profile step: {p.registration_step}/6
                  {p.has_gov_id && <span style={{ marginLeft:'var(--space-2)', color:'var(--color-success)', fontWeight:600 }}>✓ Gov ID uploaded</span>}
                  {!p.has_gov_id && <span style={{ marginLeft:'var(--space-2)', color:'var(--color-error)' }}>⚠ No Gov ID</span>}
                </div>
              </div>

              <Link to={`/admin/profile/${p.profile_id}`} className="btn btn-primary btn-sm" style={{ flexShrink:0, marginLeft:'auto' }}>
                Review Profile →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
