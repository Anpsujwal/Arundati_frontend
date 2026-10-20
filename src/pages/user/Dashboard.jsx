import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { matchesApi, interestsApi } from '../../api/matches.api';
import { Heart, Clock, CheckCircle, Search, Send, Inbox } from 'lucide-react';
import { statusClass, statusLabel } from '../../utils/format.utils';
import MangoToran from '../../components/wedding-theme/MangoToran.jsx';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

export default function Dashboard() {
  const { user, profile, isApproved, isPending } = useAuth();
  const [stats, setStats] = useState({ matches: null, sent: 0, received: 0 });

  useEffect(() => {
    if (isApproved) {
      matchesApi.feed(1, 1).then((r) => setStats((s) => ({ ...s, matches: r.data.data?.pagination?.total ?? 0 }))).catch(() => {});
      interestsApi.sent().then((r) => setStats((s) => ({ ...s, sent: r.data.data?.length ?? 0 }))).catch(() => {});
      interestsApi.received().then((r) => setStats((s) => ({ ...s, received: r.data.data?.length ?? 0 }))).catch(() => {});
    }
  }, [isApproved]);

  const name = profile?.first_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="page-enter">
      {/* Welcome hero */}
      <div style={{
        background: 'linear-gradient(135deg, #3D0A1A, var(--color-primary-dark), var(--color-primary))',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-8)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(196,147,42,0.12)' }} />
        <div style={{ position:'absolute', bottom:-30, left:-30, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        {/* Mini toran across top of hero card */}
        <div className="toran-wrap" style={{ overflow:'hidden', maxHeight:'44px' }}>
          <MangoToran density="full" color="#3A7A4A" goldColor="#C4932A" style={{ marginTop:'-10px', opacity:0.65 }} />
        </div>

        <div style={{ padding:'clamp(var(--space-5), 4vw, var(--space-8))', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'var(--text-4xl)', marginBottom:'var(--space-2)', fontFamily:'serif' }}>ॐ</div>
          <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(1.6rem, 4vw, 2.2rem)', color:'white', marginBottom:'var(--space-2)' }}>
            Namaste, {name}
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
            <span className={`badge ${statusClass(user?.account_status)}`} style={{ fontSize:'var(--text-xs)' }}>
              {statusLabel(user?.account_status)}
            </span>
          </div>
        </div>
      </div>

      {/* Status alerts */}
      {isPending && (
        <div className="alert alert-warning" style={{ marginBottom:'var(--space-6)' }}>
          <Clock size={18} style={{ flexShrink:0 }} />
          <div>
            <strong>Profile Under Verification</strong>
            <p style={{ marginTop:'var(--space-1)', fontSize:'var(--text-sm)' }}>
              Our team is reviewing your Government ID. This typically takes 24–48 hours.
              You will have full access to matchmaking features once approved.
            </p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="alert alert-success" style={{ marginBottom:'var(--space-6)' }}>
          <CheckCircle size={18} style={{ flexShrink:0 }} />
          <div>
            <strong>Profile Verified</strong>
            <p style={{ marginTop:'var(--space-1)', fontSize:'var(--text-sm)' }}>
              Your profile is active and visible to compatible matches. Start exploring!
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {isApproved && (
        <>
          <WeddingDivider label="Your Activity" style={{ marginBottom:'var(--space-6)' }} />
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap:'var(--space-4)', marginBottom:'var(--space-8)',
          }}>
            {[
              { icon: Search, label:'Compatible Matches', value: stats.matches ?? '—', link:'/matches',   color:'var(--color-primary)' },
              { icon: Send,   label:'Interests Sent',     value: stats.sent,            link:'/interests', color:'var(--color-gold-deep)' },
              { icon: Inbox,  label:'Interests Received', value: stats.received,        link:'/interests', color:'var(--color-success)' },
            ].map(({ icon: Icon, label, value, link, color }) => (
              <Link key={label} to={link} style={{ textDecoration:'none' }}>
                <div className="card card-padded card-hover card-premium" style={{ textAlign:'center' }}>
                  <div style={{
                    width:52, height:52, borderRadius:'var(--radius-lg)',
                    background: `color-mix(in srgb, ${color} 10%, white)`,
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    margin:'0 auto var(--space-3)',
                  }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', fontWeight:700, color }}>
                    {value}
                  </div>
                  <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-1)' }}>
                    {label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <WeddingDivider label="Quick Actions" style={{ marginBottom:'var(--space-6)' }} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap:'var(--space-4)' }}>
        {isApproved && (
          <Link to="/matches" style={{ textDecoration:'none' }}>
            <div className="card card-padded card-hover card-premium" style={{
              background:'linear-gradient(135deg, var(--color-primary-faint), white)',
              border:'1.5px solid rgba(123,29,58,0.18)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Subtle top stripe */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }} />
              <Heart size={30} color="var(--color-primary)" style={{ marginBottom:'var(--space-3)' }} />
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-xl)', color:'var(--color-primary)' }}>
                Find Matches
              </h3>
              <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginTop:'var(--space-2)' }}>
                Browse Gotra-safe, verified profiles that match your lineage compatibility.
              </p>
            </div>
          </Link>
        )}
        <Link to="/profile/me" style={{ textDecoration:'none' }}>
          <div className="card card-padded card-hover card-premium" style={{ position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, var(--color-gold), var(--color-primary))' }} />
            <div style={{ fontSize:'var(--text-3xl)', marginBottom:'var(--space-3)' }}>👤</div>
            <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-xl)' }}>My Profile</h3>
            <p style={{ color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginTop:'var(--space-2)' }}>
              {profile?.registration_step < 6
                ? `Complete your registration (Step ${(profile?.registration_step || 0) + 1}/6)`
                : 'View and update your profile information.'}
            </p>
            {profile?.registration_step < 6 && (
              <div style={{
                marginTop:'var(--space-3)',
                background:'var(--color-border)', borderRadius:'var(--radius-full)',
                height:'6px', overflow:'hidden',
              }}>
                <div style={{
                  width:`${((profile?.registration_step || 0) / 6) * 100}%`,
                  height:'100%',
                  background:'linear-gradient(90deg, var(--color-primary), var(--color-gold))',
                  borderRadius:'var(--radius-full)',
                  transition:'width 0.5s ease',
                }} />
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
