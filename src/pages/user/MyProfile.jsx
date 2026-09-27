import { useEffect, useState } from 'react';
import { profileApi } from '../../api/profile.api';
import { getMyKundali, getMyChart } from '../../api/kundali.api';
import { useAuth } from '../../contexts/AuthContext';
import { calcAge, formatHeight, formatDate, photoUrl, statusLabel, statusClass } from '../../utils/format.utils';
import SouthIndianChart from '../../components/kundali/SouthIndianChart';
import KundaliLegend from '../../components/kundali/KundaliLegend';
import OrnamentalFrame from '../../components/wedding-theme/OrnamentalFrame.jsx';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display:'flex', gap:'var(--space-4)',
      padding:'var(--space-2) 0',
      borderBottom:'1px solid var(--color-border)',
    }}>
      <span style={{ minWidth:160, color:'var(--color-text-muted)', fontSize:'var(--text-sm)', fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:'var(--text-sm)' }}>{value}</span>
    </div>
  );
}

export default function MyProfile() {
  const { user } = useAuth();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [kundali, setKundali]   = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    profileApi.me().then((r) => setData(r.data.data)).finally(() => setLoading(false));
    getMyKundali().then((k) => setKundali(k)).catch(() => {});
    getMyChart().then((cd) => setChartData(cd)).catch(() => {});
  }, []);

  if (loading) return (
    <div style={{ textAlign:'center', padding:'var(--space-20)' }}>
      <div className="spinner spinner-lg" style={{ margin:'0 auto' }} />
    </div>
  );

  const { profile, astro, family, photos } = data || {};
  const age = calcAge(profile?.date_of_birth);
  const primaryPhoto = photos?.find((p) => p.is_primary);

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ marginBottom:'var(--space-6)' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
          My Profile
        </h1>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginTop:'var(--space-2)' }}>
          <span className={`badge ${statusClass(user?.account_status)}`}>{statusLabel(user?.account_status)}</span>
        </div>
      </div>

      {/* Profile hero card */}
      <div className="card card-premium" style={{ padding:'var(--space-6)', marginBottom:'var(--space-6)', display:'flex', gap:'var(--space-6)', flexWrap:'wrap', position:'relative', overflow:'hidden' }}>
        {/* Gold top stripe */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))' }} />

        {/* Avatar */}
        <div style={{
          width:120, height:120, borderRadius:'var(--radius-xl)',
          overflow:'hidden', border:'3px solid rgba(196,147,42,0.40)',
          background:'var(--color-surface-2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0,
          boxShadow:'var(--shadow-gold)',
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

      {/* Info sections */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)' }}>
        <div>
          <div style={{ marginBottom:'var(--space-8)' }}>
            <h2 className="section-title">Lineage</h2>
            <InfoRow label="Sub-Sect"    value={profile?.sub_sect} />
            <InfoRow label="Gotra"       value={profile?.gotra} />
            <InfoRow label="Pravara"     value={profile?.pravara} />
            <InfoRow label="Veda"        value={profile?.veda} />
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
            <InfoRow label="Education"     value={profile?.education} />
            <InfoRow label="Profession"    value={profile?.profession} />
            <InfoRow label="Employer"      value={profile?.employer} />
            <InfoRow label="Income"        value={profile?.hide_income ? 'Hidden' : profile?.annual_income} />
            <InfoRow label="Dietary Habit" value={profile?.dietary_habit} />
          </div>
        </div>

        <div>
          <div style={{ marginBottom:'var(--space-8)' }}>
            <h2 className="section-title">Family</h2>
            <InfoRow label="Father"          value={family?.father_name} />
            <InfoRow label="Mother"          value={family?.mother_name} />
            <InfoRow label="Siblings"        value={family?.sibling_count != null ? String(family.sibling_count) : null} />
            <InfoRow label="Elder Reference 1" value={family?.elder_ref_1_name} />
            <InfoRow label="Elder Reference 2" value={family?.elder_ref_2_name} />
            <InfoRow label="Elder Reference 3" value={family?.elder_ref_3_name} />
          </div>
          {photos && photos.length > 0 && (
            <div>
              <h2 className="section-title">Photos</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-2)' }}>
                {photos.map((p) => (
                  <div key={p.photo_id} style={{ aspectRatio:'1', borderRadius:'var(--radius-md)', overflow:'hidden', border:'1px solid var(--color-border)' }}>
                    <img src={photoUrl(p.filename)} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          KUNDALI SECTION — Ornamentally framed but chart is FULLY UNCHANGED
          ═══════════════════════════════════════════════════════════════════════ */}
      {kundali && (
        <div style={{ marginTop:'var(--space-8)' }}>
          <WeddingDivider label="Kundali" style={{ marginBottom:'var(--space-5)' }} />

          <OrnamentalFrame title="My Kundali" showToran={true}>
            {/* Chart — unchanged when generated */}
            {chartData?.kundali_status === 'GENERATED' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)', alignItems:'start' }}>
                {/* South Indian chart — completely unchanged */}
                <div>
                  <SouthIndianChart
                    chartData={chartData}
                    title="D1 · Rasi Chart"
                  />
                  <div style={{ marginTop:'var(--space-3)' }}>
                    <KundaliLegend />
                  </div>
                </div>

                {/* Kundali data panel */}
                <div>
                  {/* Core Kundali facts */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)', marginBottom:'var(--space-5)' }}>
                    {[
                      { label:'Lagna',          value: kundali.lagna,         emoji:'♈' },
                      { label:'Rashi',           value: kundali.rashi,         emoji:'🌙' },
                      { label:'Nakshatra',       value: kundali.nakshatra,     emoji:'⭐' },
                      { label:'Nakshatra Pada',  value: kundali.nakshatra_pada ? `Pada ${kundali.nakshatra_pada}` : null, emoji:'🔢' },
                    ].map(({ label, value, emoji }) => value && (
                      <div key={label} style={{
                        textAlign:'center', padding:'var(--space-3)',
                        background:'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
                        borderRadius:'var(--radius-lg)',
                        border:'1px solid rgba(196,147,42,0.20)',
                      }}>
                        <div style={{ fontSize:20, marginBottom:2 }}>{emoji}</div>
                        <div style={{ fontWeight:700, fontSize:'var(--text-sm)', color:'var(--color-text)' }}>{value}</div>
                        <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:2 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Planet table — unchanged */}
                  {chartData.planets?.length > 0 && (
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'var(--text-xs)' }}>
                        <thead>
                          <tr style={{ background:'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))' }}>
                            {['Planet','Rashi','House','Nakshatra','Pada','Deg'].map((h) => (
                              <th key={h} style={{
                                padding:'6px 6px', textAlign:'left', fontWeight:600,
                                color:'var(--color-text-muted)', borderBottom:'1px solid var(--color-border)',
                                whiteSpace:'nowrap',
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.planets.map((p) => (
                            <tr key={p.name} style={{ borderBottom:'1px solid var(--color-border)' }}>
                              <td style={{ padding:'4px 6px', fontWeight:600, color:'var(--color-primary)' }}>{p.name}</td>
                              <td style={{ padding:'4px 6px' }}>{p.rashi}</td>
                              <td style={{ padding:'4px 6px', color:'var(--color-text-muted)' }}>{p.house}</td>
                              <td style={{ padding:'4px 6px', color:'var(--color-text-muted)' }}>{p.nakshatra}</td>
                              <td style={{ padding:'4px 6px', color:'var(--color-text-muted)' }}>{p.nakshatra_pada}</td>
                              <td style={{ padding:'4px 6px', color:'var(--color-text-muted)' }}>
                                {p.degree != null ? Number(p.degree).toFixed(2) + '°' : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {kundali.generated_at && (
                    <p style={{ fontSize:'10px', color:'var(--color-text-muted)', marginTop:'var(--space-3)' }}>
                      Generated: {new Date(kundali.generated_at).toLocaleString()} · Provider: {kundali.provider}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Non-generated states — unchanged */}
            {kundali.kundali_status === 'GENERATING' && (
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', color:'var(--color-text-muted)', padding:'var(--space-4)' }}>
                <div className="spinner" />
                <span>Your Kundali is being generated… please check back shortly.</span>
              </div>
            )}
            {kundali.kundali_status === 'INCOMPLETE_BIRTH_DATA' && (
              <p style={{ color:'var(--color-error)', fontSize:'var(--text-sm)' }}>
                ⚠ Your birth information is incomplete. Please contact support or update Step 3 of your registration.
              </p>
            )}
            {kundali.kundali_status === 'FAILED' && (
              <p style={{ color:'var(--color-error)', fontSize:'var(--text-sm)' }}>
                ⚠ Kundali generation encountered an issue. Please contact the administrator.
              </p>
            )}
            {!['GENERATED','GENERATING','INCOMPLETE_BIRTH_DATA','FAILED'].includes(kundali.kundali_status) && (
              <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)' }}>
                Your Kundali will be generated automatically once your profile is approved.
              </p>
            )}
          </OrnamentalFrame>
        </div>
      )}
    </div>
  );
}
