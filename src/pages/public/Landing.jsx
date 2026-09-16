import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const FEATURES = [
  { icon: Shield, title: 'Government Verified', desc: 'Every profile is verified with a government-issued ID by our administration team before becoming visible.' },
  { icon: Heart, title: 'Gotra-Safe Matching', desc: 'Our platform automatically enforces traditional Gotra restrictions, showing only compatible matches.' },
  { icon: Users, title: 'Vicharana References', desc: 'Family elder references and Purohit connections are collected to honour traditional matchmaking practices.' },
  { icon: Star, title: 'Lineage Focused', desc: 'Detailed Gotra, Pravara, Veda, Shakha, and Sutra information ensures cultural alignment from the start.' },
];

const STATS = [
  { label: 'Verified Profiles', value: '2,400+' },
  { label: 'Successful Alliances', value: '380+' },
  { label: 'Brahmin Gotras', value: '40+' },
  { label: 'Years of Tradition', value: '5,000+' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, #A02259 100%)',
        color: 'white',
        padding: 'var(--space-20) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(196,147,42,0.1)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          {/* Ом symbol */}
          <div style={{
            fontSize: 'var(--text-5xl)',
            marginBottom: 'var(--space-4)',
            opacity: 0.85,
            lineHeight: 1,
          }}>ॐ</div>

          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            opacity: 0.75,
            color: 'var(--color-gold-light)',
            marginBottom: 'var(--space-3)',
          }}>
            A Sacred Alliance Platform
          </p>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 'var(--space-6)',
            color: 'white',
          }}>
            Find Your Soulmate<br />
            <span style={{ color: 'var(--color-gold-light)' }}>Within the Sacred Lineage</span>
          </h1>

          <p style={{
            fontSize: 'var(--text-xl)',
            opacity: 0.88,
            maxWidth: '600px',
            margin: '0 auto var(--space-10)',
            lineHeight: 1.7,
          }}>
            Arundhati brings the wisdom of Vedic tradition to modern matchmaking.
            Connect with verified Brahmin families who share your Gotra heritage, values, and aspirations.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gold btn-xl">
              Begin Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-xl" style={{
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.35)',
            }}>
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{
            display: 'flex', gap: 'var(--space-6)', justifyContent: 'center',
            marginTop: 'var(--space-10)', flexWrap: 'wrap',
          }}>
            {['Government ID Verified', 'Gotra-Safe Algorithm', 'Elder References Collected'].map((t) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', opacity: 0.8, fontSize:'var(--text-sm)' }}>
                <CheckCircle size={16} color="var(--color-gold-light)" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-12) 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-6)',
            textAlign: 'center',
          }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1.1,
                }}>{value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '2px', fontSize: 'var(--text-sm)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
              Why Arundhati
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', color: 'var(--color-text)' }}>
              Tradition Meets Trust
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)', maxWidth: '500px', margin: 'var(--space-3) auto 0' }}>
              Every aspect of Arundhati is designed to honour Brahmin traditions while providing a modern, secure experience.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-padded card-hover" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: 'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  border: '1px solid var(--color-border)',
                }}>
                  <Icon size={24} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
              Your Path to Alliance
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { step: '01', title: 'Register & Submit', desc: 'Complete the 6-step profile wizard including lineage, birth information, and family details.' },
              { step: '02', title: 'ID Verification', desc: 'Our administrators review your Government ID and approve your profile within 24–48 hours.' },
              { step: '03', title: 'Discover Matches', desc: 'Browse Gotra-safe, verified profiles and express your interest in potential alliances.' },
              { step: '04', title: 'Connect Families', desc: 'When mutual interest is expressed, families can connect through proper Vicharana channels.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ maxWidth: '220px', textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700, fontSize: 'var(--text-lg)', color: 'white',
                }}>
                  {step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-gold-faint), var(--color-primary-faint))',
        padding: 'var(--space-20) 0',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
            Begin Your Sacred Journey
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
            Join thousands of Brahmin families who have trusted Arundhati to find meaningful, verified alliances.
          </p>
          <Link to="/register" className="btn btn-primary btn-xl">
            Create Your Profile <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-primary-dark)',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        padding: 'var(--space-6)',
        fontSize: 'var(--text-sm)',
      }}>
        © {new Date().getFullYear()} Arundhati — Brahmin Alliance Matrimony Platform.
        Built with respect for tradition and community values.
      </footer>
    </div>
  );
}
