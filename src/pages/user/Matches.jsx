import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchesApi } from '../../api/matches.api';
import { interestsApi } from '../../api/matches.api';
import { calcAge, formatHeight, photoUrl, getErrorMessage } from '../../utils/format.utils';
import { Heart, MapPin, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function ProfileCard({ match, onInterestSent }) {
  const [sending, setSending] = useState(false);
  const age = calcAge(match.date_of_birth);
  const photo = match.primary_photo ? photoUrl(match.primary_photo) : null;

  const sendInterest = async (e) => {
    e.preventDefault();
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
    <Link to={`/matches/${match.profile_id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover" style={{ overflow: 'visible', height: '100%' }}>
        {/* Photo */}
        <div style={{ height: '220px', background: 'var(--color-surface-2)', position: 'relative', overflow: 'hidden' }}>
          {photo ? (
            <img src={photo} alt={match.first_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
              fontSize: '64px',
            }}>
              {match.gender === 'Female' ? '👩' : '👨'}
            </div>
          )}
          {/* Verified badge */}
          <div style={{
            position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
            background: 'var(--color-success)', borderRadius: 'var(--radius-full)',
            padding: '2px 8px', fontSize: '10px', color: 'white', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            ✓ Verified
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
                {match.first_name} {match.surname}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                {age ? `${age} yrs` : ''}{match.height_cm ? ` · ${formatHeight(match.height_cm)}` : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
            {match.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <MapPin size={12} /> {match.city}
              </div>
            )}
            {match.gotra && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <BookOpen size={12} /> Gotra: {match.gotra}
              </div>
            )}
            {match.profession && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                💼 {match.profession}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span className="badge badge-gold">{match.sub_sect || 'Brahmin'}</span>
            {match.marital_status && match.marital_status !== 'Unmarried' &&
              <span className="badge badge-pending">{match.marital_status}</span>}
          </div>

          <button
            onClick={sendInterest}
            disabled={sending}
            className="btn btn-primary btn-full btn-sm"
            style={{ marginTop: 'var(--space-3)' }}
          >
            <Heart size={14} fill={sending ? 'white' : 'none'} />
            {sending ? 'Sending…' : 'Express Interest'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [sentIds, setSentIds] = useState(new Set());

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
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
          Compatible Matches
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          Showing Gotra-compatible, verified profiles
          {pagination.total > 0 ? ` — ${pagination.total} matches found` : ''}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Finding compatible profiles…</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🪷</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>No Matches Yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            There are no Gotra-compatible approved profiles at the moment. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--space-5)',
            marginBottom: 'var(--space-8)',
          }}>
            {matches.map((m) => (
              <ProfileCard key={m.profile_id} match={m} onInterestSent={handleInterestSent} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button className="btn btn-outline btn-sm"
                disabled={pagination.page <= 1}
                onClick={() => loadMatches(pagination.page - 1)}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
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
