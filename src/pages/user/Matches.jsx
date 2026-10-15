import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { matchesApi, interestsApi } from '../../api/matches.api';
import { calcAge, formatHeight, photoUrl, getErrorMessage } from '../../utils/format.utils';
import {
  Heart, MapPin, BookOpen, ChevronLeft, ChevronRight,
  Star, Flag, Clock, X, CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';
import FloralDecoration from '../../components/wedding-theme/FloralDecoration.jsx';

// ─── Grade config ────────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
  {
    key:   'Prioritize',
    label: 'Prioritize',
    icon:  Flag,
    color: '#22c55e',        // green
    bg:    'rgba(34,197,94,0.12)',
    border:'rgba(34,197,94,0.35)',
  },
  {
    key:   'MaybeLater',
    label: 'Maybe Later',
    icon:  Clock,
    color: '#f59e0b',        // amber
    bg:    'rgba(245,158,11,0.12)',
    border:'rgba(245,158,11,0.35)',
  },
  {
    key:   'NotInterested',
    label: 'Not Interested',
    icon:  X,
    color: '#ef4444',        // red
    bg:    'rgba(239,68,68,0.12)',
    border:'rgba(239,68,68,0.35)',
  },
  {
    key:   'AlreadyDealt',
    label: 'Already Dealt',
    icon:  CheckCircle2,
    color: '#8b5cf6',        // purple
    bg:    'rgba(139,92,246,0.12)',
    border:'rgba(139,92,246,0.35)',
  },
];

// ─── Guna badge ──────────────────────────────────────────────────────────────
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

// ─── Grade badge (shown on card when a grade is active) ──────────────────────
function GradeBadge({ grade }) {
  if (!grade) return null;
  const opt = GRADE_OPTIONS.find((o) => o.key === grade);
  if (!opt) return null;
  const Icon = opt.icon;
  return (
    <div style={{
      position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)',
      background: opt.bg,
      border: `1.5px solid ${opt.border}`,
      borderRadius: 'var(--radius-full)', padding: '3px 10px',
      fontSize: '11px', color: opt.color, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: '4px',
      backdropFilter: 'blur(4px)',
      zIndex: 2,
    }}>
      <Icon size={11} />
      {opt.label}
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({ match, onInterestSent, onGraded, onAlreadyDealt }) {
  const [sending,     setSending]     = useState(false);
  const [grading,     setGrading]     = useState(false);
  const [activeGrade, setActiveGrade] = useState(match.user_grade ?? null);
  const [showGrades,  setShowGrades]  = useState(false);

  const age   = calcAge(match.date_of_birth);
  const photo = match.primary_photo ? photoUrl(match.primary_photo) : null;
  const guna  = match.guna_milan;

  const handleSendInterest = async (e) => {
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

  const handleGrade = async (e, gradeKey) => {
    e.preventDefault();
    e.stopPropagation();
    setGrading(true);
    try {
      await matchesApi.gradeProfile(match.profile_id, gradeKey);
      setActiveGrade(gradeKey);
      setShowGrades(false);
      onGraded(match.profile_id, gradeKey);

      const opt = GRADE_OPTIONS.find((o) => o.key === gradeKey);
      if (gradeKey === 'AlreadyDealt') {
        toast.success('Profile marked as "Already Dealt" and removed from feed.');
        onAlreadyDealt(match.profile_id);
      } else {
        toast.success(`Marked as "${opt.label}"`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setGrading(false); }
  };

  return (
    <div
      className="card card-hover profile-card-wedding"
      style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Gold top stripe */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))', opacity: 0.6 }} />

      {/* Photo area */}
      <Link to={`/matches/${match.profile_id}`} style={{ textDecoration: 'none', position: 'relative' }}>
        <div style={{ height: '220px', background: 'var(--color-surface-2)', position: 'relative', overflow: 'hidden' }}>
          {photo ? (
            <img src={photo} alt={match.first_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
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

          {/* Grade badge (top-left) */}
          <GradeBadge grade={activeGrade} />

          {/* Verified badge (top-right) */}
          <div style={{
            position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
            background: 'var(--color-success)', borderRadius: 'var(--radius-full)',
            padding: '2px 8px', fontSize: '10px', color: 'white', fontWeight: 600,
          }}>
            ✓ Verified
          </div>

          {/* Guna Milan score */}
          <GunaBadge guna={guna} />
        </div>

        {/* Info */}
        <div style={{ padding: 'var(--space-4)', paddingBottom: 'var(--space-2)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>
            {match.first_name} {match.surname}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            {age ? `${age} yrs` : ''}{match.height_cm ? ` · ${formatHeight(match.height_cm)}` : ''}
          </p>

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

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span className="badge badge-gold">{match.sub_sect || 'Brahmin'}</span>
            {match.marital_status && match.marital_status !== 'Never Married' &&
              <span className="badge badge-pending">{match.marital_status}</span>}
            {guna?.doshas?.length > 0 &&
              <span style={{ fontSize: '10px', color: 'var(--color-error)', background: '#fff0f0', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                ⚠ Dosha noted
              </span>}
          </div>
        </div>
      </Link>

      {/* ── Action bar ─────────────────────────────────────────────────────── */}
      <div style={{ padding: 'var(--space-3) var(--space-4) var(--space-2)', display: 'flex', gap: 'var(--space-2)', marginTop: 'auto', borderTop: '1px solid var(--color-border)' }}>
        <Link
          to={`/matches/${match.profile_id}/compatibility`}
          className="btn btn-outline btn-sm"
          style={{ flex: 1, textAlign: 'center', fontSize: '12px' }}
        >
          🔮 Compatibility
        </Link>
        <button
          onClick={handleSendInterest}
          disabled={sending}
          className="btn btn-primary btn-sm"
          style={{ flex: 1, fontSize: '12px' }}
        >
          <Heart size={13} fill={sending ? 'white' : 'none'} />
          {sending ? 'Sending…' : 'Interest'}
        </button>
      </div>

      {/* ── Grade / Filter bar ──────────────────────────────────────────────── */}
      <div style={{ padding: '0 var(--space-4) var(--space-3)' }}>
        <button
          onClick={(e) => { e.preventDefault(); setShowGrades((v) => !v); }}
          style={{
            width: '100%', padding: '6px 0',
            background: showGrades ? 'var(--color-surface-2)' : 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer', fontSize: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'background 0.2s',
          }}
        >
          <span style={{ fontSize: '14px' }}>🏷️</span>
          {activeGrade
            ? `Grade: ${GRADE_OPTIONS.find((o) => o.key === activeGrade)?.label}`
            : 'Grade this profile'}
          <span style={{ fontSize: '10px', opacity: 0.6 }}>{showGrades ? '▲' : '▼'}</span>
        </button>

        {showGrades && (
          <div style={{
            marginTop: 'var(--space-2)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-2)',
          }}>
            {GRADE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = activeGrade === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={(e) => handleGrade(e, opt.key)}
                  disabled={grading}
                  title={opt.label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '5px', padding: '7px 4px',
                    background: isActive ? opt.bg : 'transparent',
                    border: `1.5px solid ${isActive ? opt.color : opt.border}`,
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? opt.color : 'var(--color-text-muted)',
                    fontSize: '11px', fontWeight: isActive ? 700 : 500,
                    cursor: grading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = opt.bg;
                      e.currentTarget.style.color = opt.color;
                      e.currentTarget.style.borderColor = opt.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.borderColor = opt.border;
                    }
                  }}
                >
                  <Icon size={12} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Matches page ─────────────────────────────────────────────────────────────
export default function Matches() {
  const [matches,    setMatches]    = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading,    setLoading]    = useState(true);
  const [sentIds,    setSentIds]    = useState(new Set());

  const loadMatches = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await matchesApi.feed(page, 12);
      setMatches(res.data.data.matches);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadMatches(); }, [loadMatches]);

  const handleInterestSent = (id) => setSentIds((s) => new Set(s).add(id));

  // Update local grade label without hiding the card
  const handleGraded = useCallback((profileId, grade) => {
    setMatches((prev) =>
      prev.map((m) => m.profile_id === profileId ? { ...m, user_grade: grade } : m),
    );
  }, []);

  // Remove card immediately when AlreadyDealt is chosen
  const handleAlreadyDealt = useCallback((profileId) => {
    setMatches((prev) => prev.filter((m) => m.profile_id !== profileId));
    setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
  }, []);

  return (
    <div className="page-enter">
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
          Compatible Matches
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          Gotra-compatible, verified profiles with Guna Milan ≥ 18/36
          {pagination.total > 0 ? ` — ${pagination.total} matches found` : ''}
        </p>

        {/* Grade legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          {GRADE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <span key={opt.key} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                background: opt.bg, border: `1px solid ${opt.border}`,
                fontSize: '11px', color: opt.color, fontWeight: 600,
              }}>
                <Icon size={11} />{opt.label}
              </span>
            );
          })}
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
            — Use "Grade this profile" on each card
          </span>
        </div>
      </div>

      <WeddingDivider style={{ marginBottom: 'var(--space-6)' }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Calculating compatibility…</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-20)', position: 'relative' }}>
          <FloralDecoration position="top-left"  size={80} opacity={0.25} />
          <FloralDecoration position="top-right" size={80} opacity={0.25} />
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🪷</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>No Matches Yet</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', maxWidth: '400px', margin: 'var(--space-2) auto 0' }}>
            There are no Gotra-compatible approved profiles with sufficient Guna Milan score at the moment. Check back soon.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 'var(--space-5)',
            marginBottom: 'var(--space-8)',
          }}>
            {matches.map((m) => (
              <ProfileCard
                key={m.profile_id}
                match={m}
                onInterestSent={handleInterestSent}
                onGraded={handleGraded}
                onAlreadyDealt={handleAlreadyDealt}
              />
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
