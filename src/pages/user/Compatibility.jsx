import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompatibility } from '../../api/kundali.api';
import { getErrorMessage } from '../../utils/format.utils';
import { ArrowLeft, Star, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import OrnamentalFrame from '../../components/wedding-theme/OrnamentalFrame.jsx';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

// ─── Sub-components ────────────────────────────────────────────────────────────

function ScoreBar({ obtained, maximum, label }) {
  const pct   = maximum > 0 ? (obtained / maximum) * 100 : 0;
  const color = pct >= 75 ? 'var(--color-success)'
    : pct >= 50 ? 'var(--color-gold)'
    : 'var(--color-error)';
  return (
    <div style={{ marginBottom:'var(--space-3)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'var(--text-sm)', color:'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize:'var(--text-sm)', fontWeight:600, color }}>{obtained} / {maximum}</span>
      </div>
      <div style={{ height:'6px', background:'var(--color-surface-2)', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:'99px', transition:'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="card card-premium" style={{ marginBottom:'var(--space-5)', overflow:'hidden' }}>
      {/* Gold accent top strip */}
      <div style={{ height:'2px', background:'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))' }} />
      <div style={{ padding:'var(--space-5)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-4)', paddingBottom:'var(--space-3)', borderBottom:'1px solid var(--color-border)' }}>
          <span style={{ fontSize:'20px' }}>{icon}</span>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-xl)', color:'var(--color-primary)' }}>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function HarmonyBadge({ level }) {
  const config = {
    high:        { color:'var(--color-success)', bg:'#f0fff4', label:'High Harmony'   },
    moderate:    { color:'var(--color-gold)',    bg:'#fffbeb', label:'Moderate Harmony' },
    neutral:     { color:'#6b7280',              bg:'#f9fafb', label:'Neutral'          },
    challenging: { color:'var(--color-error)',   bg:'#fff0f0', label:'Challenging'      },
  };
  const c = config[level] || config.neutral;
  return (
    <span style={{
      background:c.bg, color:c.color, border:`1px solid ${c.color}`,
      borderRadius:'var(--radius-full)', padding:'3px 12px',
      fontSize:'var(--text-sm)', fontWeight:600,
    }}>
      {c.label}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Compatibility() {
  const { id } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCompatibility(id);
        setData(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign:'center', padding:'var(--space-20)' }}>
        <div className="spinner spinner-lg" style={{ margin:'0 auto' }} />
        <p style={{ color:'var(--color-text-muted)', marginTop:'var(--space-4)' }}>Calculating compatibility…</p>
      </div>
    );
  }

  if (!data) return null;

  const { gunaMilan, kundali, preferences, overall, aiExplanation } = data;
  const comp  = kundali?.compatibility;
  const guna  = gunaMilan;

  const scoreColor = (overall?.score ?? 0) >= 70 ? 'var(--color-success)'
    : (overall?.score ?? 0) >= 50 ? 'var(--color-gold)'
    : 'var(--color-error)';

  return (
    <div className="page-enter" style={{ maxWidth:'760px', margin:'0 auto' }}>
      {/* Back */}
      <Link to={`/matches/${id}`} style={{ textDecoration:'none' }}>
        <button className="btn btn-outline btn-sm" style={{ marginBottom:'var(--space-5)' }}>
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </Link>

      {/* Hero score — wrapped in ornamental frame */}
      <OrnamentalFrame title="Compatibility Report" showToran={true} style={{ marginBottom:'var(--space-6)', textAlign:'center', padding:'var(--space-8)' }}>
        <div style={{ fontSize:'72px', fontWeight:800, color:scoreColor, lineHeight:1, marginBottom:'var(--space-2)' }}>
          {overall?.score?.toFixed(0) ?? '—'}
        </div>
        <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginBottom:'var(--space-2)' }}>
          Overall Compatibility Score
        </p>

        {guna && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'var(--space-3)', marginTop:'var(--space-4)' }}>
            <Star size={18} fill="var(--color-gold)" color="var(--color-gold)" />
            <span style={{ fontSize:'var(--text-xl)', fontWeight:700, color:'var(--color-gold-deep)' }}>
              {guna.total} / 36
            </span>
            <span style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)' }}>Guna Milan</span>
          </div>
        )}

        {guna?.doshas?.length > 0 && (
          <div style={{ marginTop:'var(--space-3)', display:'flex', justifyContent:'center', gap:'var(--space-2)', flexWrap:'wrap' }}>
            {guna.doshas.map((d) => (
              <span key={d} style={{ background:'#fff0f0', color:'var(--color-error)', border:'1px solid var(--color-error)', borderRadius:'var(--radius-full)', padding:'2px 10px', fontSize:'12px' }}>
                ⚠ {d}
              </span>
            ))}
          </div>
        )}
      </OrnamentalFrame>

      <WeddingDivider style={{ marginBottom:'var(--space-5)' }} />

      {/* Kundali info */}
      {comp && (
        <SectionCard title="Kundali Compatibility" icon="🪐">
          {comp.rashi && (
            <div style={{ marginBottom:'var(--space-4)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--space-2)' }}>
                <h3 style={{ fontSize:'var(--text-md)', fontWeight:600 }}>Rashi (Moon Sign)</h3>
                <HarmonyBadge level={comp.rashi.harmonyLevel} />
              </div>
              <div style={{ display:'flex', gap:'var(--space-6)', flexWrap:'wrap', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
                <span>Person A: <strong style={{ color:'var(--color-text)' }}>{comp.rashi.rashiA}</strong> ({comp.rashi.elementA})</span>
                <span>Person B: <strong style={{ color:'var(--color-text)' }}>{comp.rashi.rashiB}</strong> ({comp.rashi.elementB})</span>
              </div>
            </div>
          )}

          {comp.nakshatra && (
            <div style={{ marginBottom:'var(--space-3)' }}>
              <h3 style={{ fontSize:'var(--text-md)', fontWeight:600, marginBottom:'var(--space-2)' }}>Nakshatra (Birth Star)</h3>
              <div style={{ display:'flex', gap:'var(--space-6)', flexWrap:'wrap', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
                <span>Person A: <strong style={{ color:'var(--color-text)' }}>{comp.nakshatra.nakshatraA}</strong> Pada {comp.nakshatra.padaA} (Lord: {comp.nakshatra.lordA})</span>
                <span>Person B: <strong style={{ color:'var(--color-text)' }}>{comp.nakshatra.nakshatraB}</strong> Pada {comp.nakshatra.padaB} (Lord: {comp.nakshatra.lordB})</span>
              </div>
              {comp.nakshatra.sameLord && (
                <p style={{ marginTop:'var(--space-2)', fontSize:'var(--text-xs)', color:'var(--color-success)' }}>
                  <CheckCircle size={12} style={{ display:'inline' }} /> Same Nakshatra Lord — similar temperament
                </p>
              )}
            </div>
          )}

          {comp.warnings?.length > 0 && (
            <div style={{ marginTop:'var(--space-3)', padding:'var(--space-3)', background:'#fff8ed', borderRadius:'var(--radius-md)', border:'1px solid var(--color-gold)' }}>
              {comp.warnings.map((w, i) => (
                <p key={i} style={{ fontSize:'var(--text-sm)', color:'#92400e', display:'flex', gap:'var(--space-2)', alignItems:'flex-start' }}>
                  <AlertTriangle size={14} style={{ flexShrink:0, marginTop:'2px' }} /> {w}
                </p>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* Ashta Koota */}
      {guna && (
        <SectionCard title="Ashta Koota / Guna Milan" icon="⭐">
          <div style={{ marginBottom:'var(--space-4)', padding:'var(--space-3)', background:'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))', borderRadius:'var(--radius-md)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:600 }}>Total Score</span>
            <span style={{ fontSize:'var(--text-2xl)', fontWeight:800, color: guna.total >= 28 ? 'var(--color-success)' : guna.total >= 18 ? 'var(--color-gold-deep)' : 'var(--color-error)' }}>
              {guna.total} <span style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', fontWeight:400 }}>/ 36</span>
            </span>
          </div>
          <ScoreBar obtained={guna.varna?.obtained ?? 0}       maximum={1} label="Varna (Spiritual Compatibility)"  />
          <ScoreBar obtained={guna.vashya?.obtained ?? 0}      maximum={2} label="Vashya (Attraction / Dominance)"   />
          <ScoreBar obtained={guna.tara?.obtained ?? 0}        maximum={3} label="Tara (Birth Star Compatibility)"    />
          <ScoreBar obtained={guna.yoni?.obtained ?? 0}        maximum={4} label="Yoni (Intimate Compatibility)"      />
          <ScoreBar obtained={guna.grahaMaitri?.obtained ?? 0} maximum={5} label="Graha Maitri (Planetary Friendship)"/>
          <ScoreBar obtained={guna.gana?.obtained ?? 0}        maximum={6} label="Gana (Nature / Temperament)"        />
          <ScoreBar obtained={guna.bhakoot?.obtained ?? 0}     maximum={7} label="Bhakoot (Rashi Interval)"           />
          <ScoreBar obtained={guna.nadi?.obtained ?? 0}        maximum={8} label="Nadi (Constitutional Match)"         />

          {[
            { key:'varna', label:'Varna' }, { key:'vashya', label:'Vashya' },
            { key:'tara',  label:'Tara'  }, { key:'yoni',   label:'Yoni'   },
            { key:'grahaMaitri', label:'Graha Maitri' }, { key:'gana', label:'Gana' },
            { key:'bhakoot', label:'Bhakoot' }, { key:'nadi', label:'Nadi' },
          ].map(({ key, label }) => guna[key]?.detail && (
            <div key={key} style={{ fontSize:'11px', color:'var(--color-text-muted)', marginBottom:'2px' }}>
              <strong>{label}:</strong> {guna[key].detail}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Profile Preferences */}
      {preferences && (
        <SectionCard title="Profile Preferences" icon="💼">
          {preferences.age && (
            <div style={{ marginBottom:'var(--space-3)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'var(--text-sm)', marginBottom:'4px' }}>
                <span>Age Compatibility</span>
                <span style={{ color: preferences.age.score >= 0.8 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {preferences.age.userAge ? `${preferences.age.candidateAge} yrs` : '—'}
                </span>
              </div>
              <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{preferences.age.detail}</p>
            </div>
          )}
          {preferences.location && (
            <div style={{ marginBottom:'var(--space-3)' }}>
              <div style={{ fontSize:'var(--text-sm)', marginBottom:'4px', display:'flex', justifyContent:'space-between' }}>
                <span>Location</span>
                <span style={{ color: preferences.location.score >= 0.8 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {Math.round(preferences.location.score * 100)}% match
                </span>
              </div>
              <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{preferences.location.detail}</p>
            </div>
          )}
          {preferences.subSect && (
            <div>
              <div style={{ fontSize:'var(--text-sm)', marginBottom:'4px', display:'flex', justifyContent:'space-between' }}>
                <span>Sub-Sect</span>
                <span style={{ color: preferences.subSect.score >= 0.8 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {preferences.subSect.score >= 0.8 ? '✓ Match' : 'Different'}
                </span>
              </div>
              <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{preferences.subSect.detail}</p>
            </div>
          )}
        </SectionCard>
      )}

      {/* AI Explanation */}
      {aiExplanation?.explanation && (
        <SectionCard title="Astrological Interpretation" icon="🔮">
          <div style={{ padding:'var(--space-3)', background:'var(--color-surface-2)', borderRadius:'var(--radius-md)', marginBottom:'var(--space-3)' }}>
            {aiExplanation.explanation.split('\n\n').map((para, i) => (
              <p key={i}
                style={{ fontSize:'var(--text-sm)', color:'var(--color-text)', lineHeight:1.7, marginBottom:'var(--space-3)' }}
                dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
              />
            ))}
          </div>
          {aiExplanation.disclaimer && (
            <div style={{ display:'flex', gap:'var(--space-2)', padding:'var(--space-3)', background:'#f9fafb', borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)' }}>
              <Info size={14} style={{ flexShrink:0, color:'#6b7280', marginTop:'2px' }} />
              <p style={{ fontSize:'11px', color:'#6b7280', lineHeight:1.6 }}>{aiExplanation.disclaimer}</p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Back button */}
      <div style={{ textAlign:'center', marginTop:'var(--space-6)' }}>
        <Link to="/matches">
          <button className="btn btn-outline">← Back to Matches</button>
        </Link>
      </div>
    </div>
  );
}
