import { useEffect, useState } from 'react';
import { profileApi } from '../../api/profile.api';
import { useAuth } from '../../contexts/AuthContext';
import { calcAge, formatHeight, formatDate, photoUrl, statusLabel, statusClass } from '../../utils/format.utils';
import { Link } from 'react-router-dom';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', gap:'var(--space-4)', padding:'var(--space-2) 0', borderBottom:'1px solid var(--color-border)' }}>
      <span style={{ minWidth:160, color:'var(--color-text-muted)', fontSize:'var(--text-sm)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'var(--text-sm)' }}>{value}</span>
    </div>
  );
}

export default function MyProfile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.me().then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign:'center', padding:'var(--space-20)' }}><div className="spinner spinner-lg" style={{ margin:'0 auto' }} /></div>;

  const { profile, astro, family, photos } = data || {};
  const age = calcAge(profile?.date_of_birth);
  const primaryPhoto = photos?.find((p) => p.is_primary);

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'var(--space-6)', flexWrap:'wrap', gap:'var(--space-3)' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
            My Profile
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginTop:'var(--space-2)' }}>
            <span className={`badge ${statusClass(user?.account_status)}`}>{statusLabel(user?.account_status)}</span>
          </div>
        </div>
        <Link to="/register" className="btn btn-outline btn-sm">Edit Profile</Link>
      </div>

      {/* Profile hero */}
      <div className="card" style={{ padding:'var(--space-6)', marginBottom:'var(--space-6)', display:'flex', gap:'var(--space-6)', flexWrap:'wrap' }}>
        <div style={{
          width:120, height:120, borderRadius:'var(--radius-xl)',
          overflow:'hidden', border:'3px solid var(--color-border)',
          background:'var(--color-surface-2)', display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0,
        }}>
          {primaryPhoto
            ? <img src={photoUrl(primaryPhoto.filename)} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <span style={{ fontSize:'48px' }}>{profile?.gender === 'Female' ? '👩' : '👨'}</span>}
        </div>
        <div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-2xl)' }}>
            {profile?.first_name} {profile?.surname}
          </h2>
          <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginTop:'var(--space-1)' }}>
            {age && `${age} yrs`} {profile?.city && `· ${profile.city}`}
          </p>
          <p style={{ color:'var(--color-text-light)', fontSize:'var(--text-xs)', marginTop:'var(--space-1)' }}>
            {user?.email}
          </p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)' }}>
        <div>
          <div style={{ marginBottom:'var(--space-8)' }}>
            <h2 className="section-title">Lineage</h2>
            <InfoRow label="Sub-Sect" value={profile?.sub_sect} />
            <InfoRow label="Gotra" value={profile?.gotra} />
            <InfoRow label="Pravara" value={profile?.pravara} />
            <InfoRow label="Veda" value={profile?.veda} />
            <InfoRow label="Sect / Shakha" value={profile?.shakha} />
            <InfoRow label="Native Place" value={profile?.native_place} />
          </div>
          <div>
            <h2 className="section-title">Preferences</h2>
            <InfoRow label="Preferred Sub-Sect" value={profile?.pref_sub_sect} />
            <InfoRow label="Preferred Location" value={profile?.pref_location} />
            <InfoRow
              label="Preferred Age Difference"
              value={
                profile?.pref_age_diff_min != null && profile?.pref_age_diff_max != null
                  ? `${profile.pref_age_diff_min}–${profile.pref_age_diff_max} years`
                  : profile?.pref_age_diff_min != null
                  ? `min ${profile.pref_age_diff_min} years`
                  : profile?.pref_age_diff_max != null
                  ? `max ${profile.pref_age_diff_max} years`
                  : null
              }
            />
          </div>
          <div>
            <h2 className="section-title">Education & Career</h2>
            <InfoRow label="Education" value={profile?.education} />
            <InfoRow label="Profession" value={profile?.profession} />
            <InfoRow label="Employer" value={profile?.employer} />
            <InfoRow label="Income" value={profile?.hide_income ? 'Hidden' : profile?.annual_income} />
            <InfoRow label="Dietary Habit" value={profile?.dietary_habit} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom:'var(--space-8)' }}>
            <h2 className="section-title">Family</h2>
            <InfoRow label="Father" value={family?.father_name} />
            <InfoRow label="Mother" value={family?.mother_name} />
            <InfoRow label="Siblings" value={family?.sibling_count != null ? String(family.sibling_count) : null} />
            <InfoRow label="Elder Reference 1" value={family?.elder_ref_1_name} />
            <InfoRow label="Elder Reference 2" value={family?.elder_ref_2_name} />
            <InfoRow label="Elder Reference 3" value={family?.elder_ref_3_name} />
          </div>
          {photos && photos.length > 0 && (
            <div>
              <h2 className="section-title">Photos</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-2)' }}>
                {photos.map((p) => (
                  <div key={p.photo_id} style={{ aspectRatio:'1', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
                    <img src={photoUrl(p.filename)} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
