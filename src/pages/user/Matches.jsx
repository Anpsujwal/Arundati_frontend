import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchesApi, interestsApi } from '../../api/matches.api';
import { calcAge, formatHeight, photoUrl, getErrorMessage } from '../../utils/format.utils';
import { Heart, MapPin, BookOpen, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';
import FloralDecoration from '../../components/wedding-theme/FloralDecoration.jsx';

function GunaBadge({ guna }) {
  if (!guna) return null;
  const color = guna.total >= 28 ? 'var(--color-success)'
    : guna.total >= 18 ? 'var(--color-gold)'
    : 'var(--color-error)';
  return (
    <div style={{
      position: 'absolute', bottom: 'var(--space-3)', left: 'var(--space-3)',
      background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)',
      borderRadius: 'var(--radius-full)', padding: '3px 10px',
      fontSize: '11px', color: 'white', fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: '4px',
      border: `1.5px solid ${color}`,
    }}>
      <Star size={10} fill={color} color={color} />
      <span style={{ color }}>{guna.total}</span>
      <span style={{ opacity: 0.7 }}>/36 Guna</span>
    </div>
  );
}

function ProfileCard({ match, onInterestSent }) {
  const [sending, setSending] = useState(false);
  const age    = calcAge(match.date_of_birth);
  const photo  = match.primary_photo ? photoUrl(match.primary_photo) : null;
  const guna   = match.guna_milan;

  const sendInterest = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSending(true);
    try {
      await interestsApi.send(match.profile_id);
      toast.success('Interest sent!');
      onInterestSent(match.profile_id);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setSending(false); }
  };

  return (
    <div className="card card-hover profile-card-wedding" style={{ overflow:'hidden', height:'100%', display:'flex', flexDirection:'column', position:'relative' }}>
      {/* Subtle gold top stripe on hover — always visible as thin line */}
      <div style={{ height:'2px', background:'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))', opacity:0.6 }} />

      {/* Photo */}
      <Link to={`/matches/${match.profile_id}`} style={{ textDecoration:'none' }}>
        <div style={{ height:'220px', background:'var(--color-surface-2)', position:'relative', overflow:'hidden' }}>
          {photo ? (
            <img src={photo} alt={match.first_name}
              style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              width:'100%', height:'100%',
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
              fontSize:'64px',
            }}>
              {match.gender === 'Female' ? '👩' : '👨'}
            </div>
          )}
          {/* Verified badge */}
          <div style={{
            position:'absolute', top:'var(--space-3)', right:'var(--space-3)',
            background:'var(--color-success)', borderRadius:'var(--radius-full)',
            padding:'2px 8px', fontSize:'10px', color:'white', fontWeight:600,
          }}>
            ✓ Verified
          </div>
          {/* Guna Milan score */}
          <GunaBadge guna={guna} />
        </div>

        {/* Info */}
        <div style={{ padding:'var(--space-4)', paddingBottom:'var(--space-2)' }}>
          <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', color:'var(--color-text)', marginBottom:'var(--space-1)' }}>
            {match.first_name} {match.surname}
          </h3>
          <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginBottom:'var(--space-2)' }}>
            {age ? `${age} yrs` : ''}{match.height_cm ? ` · ${formatHeight(match.height_cm)}` : ''}
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-1)', marginBottom:'var(--space-3)' }}>
            {match.city && (
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-1)', fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                <MapPin size={12} /> {match.city}
              </div>
            )}
            {match.gotra && (
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-1)', fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                <BookOpen size={12} /> Gotra: {match.gotra}
              </div>
            )}
            {match.profession && (
              <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
                💼 {match.profession}
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
            <span className="badge badge-gold">{match.sub_sect || 'Brahmin'}</span>
            {match.marital_status && match.marital_status !== 'Never Married' &&
              <span className="badge badge-pending">{match.marital_status}</span>}
            {guna?.doshas?.length > 0 &&
              <span style={{ fontSize:'10px', color:'var(--color-error)', background:'#fff0f0', borderRadius:'var(--radius-full)', padding:'2px 8px' }}>
                ⚠ Dosha noted
              </span>}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div style={{ padding:'var(--space-3) var(--space-4) var(--space-4)', display:'flex', gap:'var(--space-2)', marginTop:'auto', borderTop:'1px solid var(--color-border)' }}>
        <Link
          to={`/matches/${match.profile_id}/compatibility`}
          className="btn btn-outline btn-sm"
          style={{ flex:1, textAlign:'center', fontSize:'12px' }}
        >
          🔮 Compatibility
        </Link>
        <button
          onClick={sendInterest}
          disabled={sending}
          className="btn btn-primary btn-sm"
          style={{ flex:1, fontSize:'12px' }}
        >
          <Heart size={13} fill={sending ? 'white' : 'none'} />
          {sending ? 'Sending…' : 'Interest'}
        </button>
      </div>
    </div>
  );
}

export default function Matches() {
  const [matches,    setMatches]    = useState([]);
  const [pagination, setPagination] = useState({ page:1, limit:12, total:0, totalPages:1 });
  const [loading,    setLoading]    = useState(true);
  const [sentIds,    setSentIds]    = useState(new Set());

  const loadMatches = async (page = 1) => {
    setLoading(true);
    try {
      const res = await matchesApi.feed(page, 12);
      setMatches(res.data.data.matches);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  useEffect(() => { loadMatches(); }, []);

  const handleInterestSent = (id) => setSentIds((s) => new Set(s).add(id));

  return (
    <div className="page-enter">
      {/* Page header */}
      <div style={{ marginBottom:'var(--space-6)' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
          Compatible Matches
        </h1>
        <p style={{ color:'var(--color-text-muted)', marginTop:'var(--space-2)' }}>
          Gotra-compatible, verified profiles with Guna Milan ≥ 18/36
          {pagination.total > 0 ? ` — ${pagination.total} matches found` : ''}
        </p>
      </div>

      <WeddingDivider style={{ marginBottom:'var(--space-6)' }} />

      {loading ? (
        <div style={{ textAlign:'center', padding:'var(--space-20)' }}>
          <div className="spinner spinner-lg" style={{ margin:'0 auto' }} />
          <p style={{ color:'var(--color-text-muted)', marginTop:'var(--space-4)' }}>Calculating compatibility…</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign:'center', padding:'var(--space-20)', position:'relative' }}>
          <FloralDecoration position="top-left"  size={80} opacity={0.25} />
          <FloralDecoration position="top-right" size={80} opacity={0.25} />
          <div style={{ fontSize:'64px', marginBottom:'var(--space-4)' }}>🪷</div>
          <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-2xl)' }}>No Matches Yet</h3>
          <p style={{ color:'var(--color-text-muted)', marginTop:'var(--space-2)', maxWidth:'400px', margin:'var(--space-2) auto 0' }}>
            There are no Gotra-compatible approved profiles with sufficient Guna Milan score at the moment. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))',
            gap:'var(--space-5)',
            marginBottom:'var(--space-8)',
          }}>
            {matches.map((m) => (
              <ProfileCard key={m.profile_id} match={m} onInterestSent={handleInterestSent} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'var(--space-3)' }}>
              <button className="btn btn-outline btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => loadMatches(pagination.page - 1)}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button className="btn btn-outline btn-sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadMatches(pagination.page + 1)}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
