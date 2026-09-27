import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Star, CheckCircle, ArrowRight, Moon, Sparkles, BookOpen } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import MangoToran from '../../components/wedding-theme/MangoToran.jsx';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';
import FloralDecoration from '../../components/wedding-theme/FloralDecoration.jsx';

const FEATURES = [
  {
    icon: Moon,
    title: 'Kundali-Based Matchmaking',
    desc: 'Our Vedic astrology engine calculates Ashta Koota Guna Milan (36 points), Lagna, Rashi & Nakshatra compatibility for every match — automatically.',
    highlight: true,
  },
  {
    icon: Shield,
    title: 'Government ID Verified',
    desc: 'Every profile is reviewed with a government-issued ID by our administration team before it becomes visible to any match.',
    highlight: false,
  },
  {
    icon: Heart,
    title: 'Gotra-Safe Algorithm',
    desc: 'Our platform enforces traditional Gotra restrictions server-side — only Gotra-compatible profiles ever appear in your matches.',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Vicharana References',
    desc: 'Family elder references and Purohit connections are collected to honour the traditional matchmaking practices of our community.',
    highlight: false,
  },
  {
    icon: Star,
    title: 'Deep Lineage Profiles',
    desc: 'Gotra, Pravara, Veda, Shakha, Sutra — every lineage detail is captured to ensure true cultural and spiritual alignment.',
    highlight: false,
  },
  {
    icon: BookOpen,
    title: 'Preference-Based Ranking',
    desc: 'Age difference, location, and sub-sect preferences are applied as hard filters and ranking signals so your feed is always relevant.',
    highlight: false,
  },
];

const STATS = [
  { label: 'Verified Profiles',     value: '2,400+' },
  { label: 'Successful Alliances',  value: '380+'   },
  { label: 'Brahmin Gotras',        value: '40+'    },
  { label: 'Years of Tradition',    value: '5,000+' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Build Profile', desc: 'Complete the guided wizard: personal details, lineage, astrology birth data, and family information.', emoji: '📋' },
  { step: '02', title: 'ID Verification',          desc: 'Our team reviews your Government ID within 24–48 hours and approves your profile for the community.', emoji: '✅' },
  { step: '03', title: 'Kundali Generated',         desc: 'Our Vedic astrology engine automatically generates your Kundali — Lagna, Rashi, Nakshatra and planetary positions.', emoji: '🔯' },
  { step: '04', title: 'Discover Sacred Matches',  desc: 'Browse ranked, Gotra-safe, Kundali-compatible profiles. See your Guna Milan score for every match.', emoji: '💞' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="hero-wedding" style={{ padding: 'var(--space-24) 0 var(--space-20)' }}>
        {/* Decorative radial glows */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'480px', height:'480px', borderRadius:'50%', background:'radial-gradient(circle, rgba(196,147,42,0.14) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        <div className="container" style={{ position:'relative', textAlign:'center', zIndex:1 }}>
          {/* OM with glow */}
          <div style={{
            fontSize: '4.5rem', marginBottom: 'var(--space-5)', lineHeight: 1,
            animation: 'heroOmPulse 3.5s ease-in-out infinite',
            display: 'inline-block',
            fontFamily: 'serif',
            color: 'rgba(255,255,255,0.92)',
            textShadow: '0 0 32px rgba(196,147,42,0.7)',
          }}>ॐ</div>

          <p style={{
            fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)',
            letterSpacing: '5px', textTransform: 'uppercase',
            color: 'var(--color-gold-light)', marginBottom: 'var(--space-4)', opacity: 0.9,
          }}>
            A Sacred Alliance Platform
          </p>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            fontWeight: 700, lineHeight: 1.18,
            marginBottom: 'var(--space-4)', color: 'white',
            textShadow: '0 2px 20px rgba(0,0,0,0.25)',
          }}>
            Find Your Soulmate<br />
            <span style={{ color: 'var(--color-gold-light)' }}>Within the Sacred Lineage</span>
          </h1>

          {/* Koota badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'rgba(196,147,42,0.16)', border: '1px solid rgba(196,147,42,0.40)',
            borderRadius: 'var(--radius-full)', padding: 'var(--space-2) var(--space-5)',
            marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)',
            color: 'var(--color-gold-light)', fontWeight: 500,
            backdropFilter: 'blur(8px)',
          }}>
            <Sparkles size={14} />
            Powered by Vedic Kundali · Ashta Koota Guna Milan (36 Points)
            <Sparkles size={14} />
          </div>

          <p style={{
            fontSize: 'var(--text-xl)', opacity: 0.88,
            maxWidth: '640px', margin: '0 auto var(--space-10)', lineHeight: 1.75,
          }}>
            Arundhati brings the wisdom of Vedic tradition to modern matchmaking.
            Every match is ranked by <strong style={{ color: 'var(--color-gold-light)', fontWeight: 600 }}>Kundali compatibility</strong>, Gotra safety, and your personal preferences.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gold btn-xl" style={{ boxShadow: '0 4px 24px rgba(196,147,42,0.40)' }}>
              Begin Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-xl" style={{
              background: 'rgba(255,255,255,0.10)', color: 'white',
              border: '1.5px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)',
            }}>
              Sign In
            </Link>
          </div>

          {/* Trust signals */}
          <div style={{
            display: 'flex', gap: 'var(--space-6)', justifyContent: 'center',
            marginTop: 'var(--space-12)', flexWrap: 'wrap',
          }}>
            {['Government ID Verified', 'Kundali Auto-Generated', 'Gotra-Safe Algorithm', 'Elder References Collected'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', opacity: 0.82, fontSize: 'var(--text-sm)' }}>
                <CheckCircle size={15} color="var(--color-gold-light)" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toran divider below hero */}
      <div style={{ background: 'var(--color-surface)', paddingTop: 'var(--space-2)', overflow: 'hidden' }}>
        <div className="toran-wrap">
          <MangoToran density="medium" color="#3A7A4A" goldColor="#C4932A" style={{ opacity: 0.7 }} />
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-6)', textAlign: 'center' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ padding: 'var(--space-4) 0' }}>
                <div className="stat-value-gradient" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-4xl)', fontWeight: 700, lineHeight: 1.1,
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-24) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <p style={{ color: 'var(--color-gold)', fontWeight: 600, letterSpacing: '3px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
              Why Arundhati
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
              Tradition Meets Technology
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
              Every feature is designed to honour Brahmin traditions while providing a modern, secure, and intelligent matchmaking experience.
            </p>
          </div>

          <WeddingDivider style={{ marginBottom: 'var(--space-12)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {FEATURES.map(({ icon: Icon, title, desc, highlight }) => (
              <div key={title} className={`card card-hover card-premium ${highlight ? '' : ''}`} style={{
                textAlign: 'center', padding: 'var(--space-8) var(--space-6)',
                border: highlight ? '1.5px solid rgba(196,147,42,0.50)' : '1px solid var(--color-border)',
                background: highlight
                  ? 'linear-gradient(160deg, #FDF5EC 0%, #FDF0F4 100%)'
                  : 'var(--color-surface)',
                position: 'relative', overflow: 'visible',
              }}>
                {highlight && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-primary))',
                    color: 'white', fontSize: '0.62rem', fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    padding: '4px 16px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
                  }}>
                    ✦ Core Feature
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '64px', height: '64px',
                  background: highlight
                    ? 'linear-gradient(135deg, var(--color-gold), var(--color-primary))'
                    : 'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-5)',
                  border: highlight ? 'none' : '1px solid var(--color-border)',
                  boxShadow: highlight ? 'var(--shadow-gold)' : 'none',
                }}>
                  <Icon size={28} color={highlight ? 'white' : 'var(--color-primary)'} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)',
                  marginBottom: 'var(--space-3)',
                  color: highlight ? 'var(--color-primary-dark)' : 'var(--color-text)',
                }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.75 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kundali Spotlight ───────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(145deg, #3D0A1A 0%, var(--color-primary-dark) 50%, var(--color-primary) 100%)',
        padding: 'var(--space-24) 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 15% 50%, rgba(196,147,42,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.04) 0%, transparent 40%)', pointerEvents:'none' }} />

        {/* Toran above content */}
        <div className="toran-wrap" style={{ position:'absolute', top:0, left:0, right:0, zIndex:1 }}>
          <MangoToran density="light" color="#3A7A4A" goldColor="#C4932A" style={{ opacity:0.55 }} />
        </div>

        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'var(--space-12)', alignItems:'center' }}>
            <div>
              <p style={{ color:'var(--color-gold-light)', fontWeight:600, letterSpacing:'3px', fontSize:'var(--text-xs)', textTransform:'uppercase', marginBottom:'var(--space-4)' }}>
                Vedic Astrology at Its Core
              </p>
              <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(1.8rem, 4vw, 3rem)', color:'white', marginBottom:'var(--space-5)', lineHeight:1.2 }}>
                Every Match is Backed by<br />
                <span style={{ color:'var(--color-gold-light)' }}>Kundali Science</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,0.78)', lineHeight:1.85, marginBottom:'var(--space-8)' }}>
                When your profile is approved, our system automatically generates your Kundali using precise birth data.
                Every potential match is scored using the complete Ashta Koota framework — the same method trusted by Brahmin families for generations.
                Only matches scoring <strong style={{ color:'var(--color-gold-light)' }}>18 or more out of 36</strong> are shown to you.
              </p>
              <Link to="/register" className="btn btn-gold btn-lg" style={{ boxShadow:'0 4px 24px rgba(196,147,42,0.45)' }}>
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {[
                { label: 'Varna Koota',   pts: 1, desc: 'Spiritual & social compatibility' },
                { label: 'Vasya Koota',   pts: 2, desc: 'Mutual attraction & control' },
                { label: 'Tara Koota',    pts: 3, desc: 'Birth star compatibility' },
                { label: 'Yoni Koota',    pts: 4, desc: 'Physical & biological harmony' },
                { label: 'Grah Maitri',   pts: 5, desc: 'Planetary friendship' },
                { label: 'Gana Koota',    pts: 6, desc: 'Temperament & nature' },
                { label: 'Bhakoot Koota', pts: 7, desc: 'Emotional & family welfare' },
                { label: 'Nadi Koota',    pts: 8, desc: 'Health & progeny — highest weight' },
              ].map(({ label, pts, desc }) => (
                <div key={label} style={{
                  display:'flex', alignItems:'center', gap:'var(--space-3)',
                  background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.11)',
                  borderRadius:'var(--radius-md)', padding:'var(--space-3) var(--space-4)',
                  backdropFilter:'blur(8px)',
                  transition: 'background var(--transition-fast)',
                }}>
                  <div style={{
                    minWidth:'34px', height:'34px',
                    background:'linear-gradient(135deg, var(--color-gold), var(--color-gold-deep))',
                    borderRadius:'var(--radius-sm)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'var(--text-sm)', color:'white',
                  }}>{pts}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:'white', fontWeight:600, fontSize:'var(--text-sm)' }}>{label}</div>
                    <div style={{ color:'rgba(255,255,255,0.50)', fontSize:'var(--text-xs)' }}>{desc}</div>
                  </div>
                  <div style={{ color:'var(--color-gold-light)', fontSize:'var(--text-xs)', fontWeight:700 }}>{pts} pts</div>
                </div>
              ))}
              <div style={{
                textAlign:'center', padding:'var(--space-3)',
                background:'rgba(196,147,42,0.15)', borderRadius:'var(--radius-md)',
                border:'1px solid rgba(196,147,42,0.35)', color:'var(--color-gold-light)',
                fontWeight:600, fontSize:'var(--text-sm)', marginTop:'var(--space-1)',
              }}>
                Total: 36 Points · Minimum 18 required for eligibility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--space-24) 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'var(--space-6)' }}>
            <p style={{ color:'var(--color-gold)', fontWeight:600, letterSpacing:'3px', fontSize:'var(--text-xs)', textTransform:'uppercase', marginBottom:'var(--space-3)' }}>
              The Journey
            </p>
            <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(1.8rem, 4vw, 3rem)' }}>
              Your Path to Alliance
            </h2>
          </div>

          <WeddingDivider style={{ marginBottom: 'var(--space-12)' }} />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'var(--space-8)' }}>
            {HOW_IT_WORKS.map(({ step, title, desc, emoji }, i) => (
              <div key={step} style={{ textAlign:'center', padding:'var(--space-4)', position:'relative' }}>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position:'absolute', top:'28px', right:'-12px',
                    fontSize:'1.2rem', color:'var(--color-gold)', opacity:0.45, zIndex:1,
                  }}>
                    &#8594;
                  </div>
                )}
                <div style={{
                  width:'72px', height:'72px',
                  background:'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))',
                  border:'2px solid var(--color-gold)', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto var(--space-4)', fontSize:'1.7rem',
                  boxShadow:'var(--shadow-gold)',
                }}>
                  {emoji}
                </div>
                <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-xs)', color:'var(--color-gold)', fontWeight:700, letterSpacing:'2px', marginBottom:'var(--space-2)' }}>
                  STEP {step}
                </div>
                <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', marginBottom:'var(--space-2)' }}>
                  {title}
                </h3>
                <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', lineHeight:1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(145deg, var(--color-gold-faint) 0%, var(--color-primary-faint) 100%)',
        padding: 'var(--space-24) 0', textAlign:'center',
        borderTop: '1px solid var(--color-border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Floral corners (desktop only) */}
        <div className="floral-corner">
          <FloralDecoration position="top-left"     size={100} opacity={0.35} />
          <FloralDecoration position="top-right"    size={100} opacity={0.35} />
          <FloralDecoration position="bottom-left"  size={80}  opacity={0.25} />
          <FloralDecoration position="bottom-right" size={80}  opacity={0.25} />
        </div>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          {/* Lotus emoji */}
          <div style={{ fontSize:'3.2rem', marginBottom:'var(--space-5)', lineHeight:1, filter:'drop-shadow(0 0 12px rgba(196,147,42,0.35))' }}>
            🪷
          </div>

          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(1.8rem, 4vw, 3rem)', color:'var(--color-primary)', marginBottom:'var(--space-4)' }}>
            Begin Your Sacred Journey
          </h2>
          <p style={{ color:'var(--color-text-muted)', maxWidth:'520px', margin:'0 auto var(--space-8)', lineHeight:1.8 }}>
            Join Brahmin families who trust Arundhati for verified, Kundali-matched, Gotra-safe alliances — rooted in tradition, built for today.
          </p>

          <WeddingDivider size="sm" style={{ maxWidth: '400px', margin: '0 auto var(--space-8)' }} />

          <div style={{ display:'flex', gap:'var(--space-4)', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-xl" style={{ boxShadow:'var(--shadow-lg)' }}>
              Create Your Profile <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-xl">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="footer-wedding" style={{ padding: 'var(--space-8) var(--space-6)', fontSize: 'var(--text-sm)' }}>
        {/* Mini toran on footer top */}
        <div className="toran-wrap" style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }}>
          <MangoToran density="light" color="#4A8A5A" goldColor="#C4932A" />
        </div>

        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--space-4)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
            <span style={{ fontSize:'1.6rem', fontFamily:'serif' }}>ॐ</span>
            <span style={{ fontFamily:'var(--font-heading)', color:'rgba(255,255,255,0.85)', fontSize:'var(--text-lg)' }}>Arundhati</span>
          </div>
          <div style={{ textAlign:'center', fontSize: 'var(--text-xs)' }}>
            &copy; {new Date().getFullYear()} Arundhati &mdash; Brahmin Alliance Matrimony Platform. Built with respect for tradition and community values.
          </div>
          <div style={{ display:'flex', gap:'var(--space-4)', fontSize:'var(--text-xs)' }}>
            <span>Kundali-Matched</span>
            <span>&middot;</span>
            <span>Gotra-Safe</span>
            <span>&middot;</span>
            <span>ID-Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
