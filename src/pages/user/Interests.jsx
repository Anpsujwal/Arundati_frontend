import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interestsApi } from '../../api/matches.api';
import { photoUrl, formatDate, getErrorMessage } from '../../utils/format.utils';
import toast from 'react-hot-toast';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

function InterestCard({ item, type, onRespond }) {
  const other = type === 'sent' ? { name: item.first_name, surname: item.surname } : { name: item.first_name, surname: item.surname };
  const photo = item.photo ? photoUrl(item.photo) : null;

  const statusColors = { Pending:'badge-pending', Accepted:'badge-approved', Declined:'badge-rejected' };

  return (
    <div className="card card-premium" style={{ display:'flex', alignItems:'center', gap:'var(--space-4)', padding:'var(--space-4)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))', opacity:0.5 }} />
      <div style={{ width:56, height:56, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:'var(--color-surface-2)', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid rgba(196,147,42,0.30)' }}>
        {photo ? <img src={photo} alt={item.first_name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span style={{ fontSize:'24px' }}>👤</span>}
      </div>
      <div style={{ flex:1 }}>
        <Link to={`/matches/${type === 'sent' ? item.receiver_profile_id : item.sender_profile_id}`}
          style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-lg)', color:'var(--color-primary)', textDecoration:'none' }}>
          {item.first_name} {item.surname}
        </Link>
        <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-1)' }}>
          {item.city && `📍 ${item.city}`} {item.gotra && ` · Gotra: ${item.gotra}`}
        </div>
        <div style={{ marginTop:'var(--space-1)' }}>
          <span className={`badge ${statusColors[item.status]}`}>{item.status}</span>
          <span style={{ fontSize:'var(--text-xs)', color:'var(--color-text-light)', marginLeft:'var(--space-3)' }}>
            {formatDate(item.created_at)}
          </span>
        </div>
      </div>
      {type === 'received' && item.status === 'Pending' && (
        <div style={{ display:'flex', gap:'var(--space-2)', flexShrink:0 }}>
          <button className="btn btn-primary btn-sm" onClick={() => onRespond(item.interest_id, 'Accepted')}>Accept</button>
          <button className="btn btn-ghost btn-sm" onClick={() => onRespond(item.interest_id, 'Declined')}>Decline</button>
        </div>
      )}
    </div>
  );
}

export default function Interests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([interestsApi.sent(), interestsApi.received()])
      .then(([s, r]) => { setSent(s.data.data || []); setReceived(r.data.data || []); })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleRespond = async (interestId, action) => {
    try {
      await interestsApi.respond(interestId, action);
      setReceived((r) => r.map((i) => i.interest_id === interestId ? { ...i, status: action } : i));
      toast.success(`Interest ${action.toLowerCase()}.`);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const items = activeTab === 'sent' ? sent : received;

  return (
    <div className="page-enter">
      <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)', marginBottom:'var(--space-4)' }}>
        Interests
      </h1>

      <WeddingDivider style={{ marginBottom:'var(--space-5)' }} />

      {/* Tabs */}
      <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-6)', borderBottom:'2px solid var(--color-border)', paddingBottom:'var(--space-1)' }}>
        {[
          { id:'received', label:`Received (${received.length})` },
          { id:'sent', label:`Sent (${sent.length})` },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            background:'none', border:'none', cursor:'pointer',
            padding:'var(--space-2) var(--space-4)',
            fontSize:'var(--text-sm)', fontWeight:600,
            color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === id ? '2px solid var(--color-primary)' : '2px solid transparent',
            marginBottom:'-2px', transition:'all var(--transition-fast)',
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'var(--space-12)' }}>
          <div className="spinner spinner-lg" style={{ margin:'0 auto' }} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign:'center', padding:'var(--space-16)', color:'var(--color-text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'var(--space-4)' }}>💌</div>
          <h3 style={{ fontFamily:'var(--font-heading)' }}>
            {activeTab === 'sent' ? 'No interests sent yet' : 'No interests received yet'}
          </h3>
          <p style={{ marginTop:'var(--space-2)', fontSize:'var(--text-sm)' }}>
            {activeTab === 'sent'
              ? <Link to="/matches" className="btn btn-primary btn-sm" style={{ marginTop:'var(--space-3)', display:'inline-flex' }}>Browse Matches</Link>
              : 'Interests from other members will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          {items.map((item) => (
            <InterestCard key={item.interest_id} item={item} type={activeTab} onRespond={handleRespond} />
          ))}
        </div>
      )}
    </div>
  );
}
