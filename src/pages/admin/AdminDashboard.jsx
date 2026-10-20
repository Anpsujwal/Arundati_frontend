import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin.api';
import { formatDate, statusClass, statusLabel } from '../../utils/format.utils';
import { Users, Shield, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.recent()])
      .then(([s, r]) => { setStats(s.data.data); setRecent(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(userId);
      setRecent((prev) => prev.filter((r) => r.user_id !== userId));
      toast.success(`${name} deleted successfully.`);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) return <div style={{ textAlign:'center', padding:'var(--space-20)' }}><div className="spinner spinner-lg" style={{ margin:'0 auto' }} /></div>;

  const STAT_CARDS = [
    { label:'Total Users', value: stats?.total, icon: Users, color:'var(--color-primary)' },
    { label:'Pending Verification', value: stats?.pending, icon: AlertCircle, color:'var(--color-warning)', link:'/admin/pending' },
    { label:'Approved', value: stats?.approved, icon: CheckCircle, color:'var(--color-success)' },
    { label:'Rejected', value: stats?.rejected, icon: XCircle, color:'var(--color-error)' },
  ];

  return (
    <div className="page-enter">
      <div style={{ marginBottom:'var(--space-6)' }}>
        <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-3xl)', color:'var(--color-primary)' }}>
          Admin Dashboard
        </h1>
        <WeddingDivider size="sm" style={{ margin: 'var(--space-2) 0 0' }} />
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap:'var(--space-4)', marginBottom:'var(--space-8)' }}>
        {STAT_CARDS.map(({ label, value, icon:Icon, color, link }) => (
          <div key={label} className="card card-padded" style={{ textAlign:'center' }}>
            <div style={{ width:48, height:48, borderRadius:'var(--radius-md)', background:`color-mix(in srgb, ${color} 12%, white)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto var(--space-3)' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-4xl)', fontWeight:700, color }}>{value ?? 0}</div>
            <div style={{ fontSize:'var(--text-sm)', color:'var(--color-text-muted)', marginTop:'var(--space-1)' }}>{label}</div>
            {link && value > 0 && <Link to={link} className="btn btn-ghost btn-sm" style={{ marginTop:'var(--space-2)' }}>View →</Link>}
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="card">
        <div style={{ padding:'var(--space-4) var(--space-5)', borderBottom:'1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily:'var(--font-heading)', fontSize:'var(--text-xl)' }}>Recent Submissions</h2>
        </div>
        <div className="table-responsive">
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'var(--text-sm)' }}>
            <thead>
              <tr style={{ background:'var(--color-surface-2)' }}>
                {['Name', 'Email', 'Gender', 'Gotra', 'Status', 'Submitted', 'Action'].map((h) => (
                  <th key={h} style={{ padding:'var(--space-3) var(--space-4)', textAlign:'left', fontWeight:600, color:'var(--color-text-muted)', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.user_id} style={{ borderTop:'1px solid var(--color-border)' }}>
                  <td style={{ padding:'var(--space-3) var(--space-4)', fontWeight:500 }}>
                    {r.first_name ? `${r.first_name} ${r.surname}` : '—'}
                  </td>
                  <td style={{ padding:'var(--space-3) var(--space-4)', color:'var(--color-text-muted)' }}>{r.email}</td>
                  <td style={{ padding:'var(--space-3) var(--space-4)' }}>{r.gender || '—'}</td>
                  <td style={{ padding:'var(--space-3) var(--space-4)' }}>{r.gotra || '—'}</td>
                  <td style={{ padding:'var(--space-3) var(--space-4)' }}>
                    <span className={`badge ${statusClass(r.account_status)}`}>{statusLabel(r.account_status)}</span>
                  </td>
                  <td style={{ padding:'var(--space-3) var(--space-4)', color:'var(--color-text-muted)' }}>{formatDate(r.created_at)}</td>
                  <td style={{ padding:'var(--space-3) var(--space-4)' }}>
                    <div style={{ display:'flex', gap:'var(--space-2)', alignItems:'center' }}>
                      {r.profile_id && (
                        <Link to={`/admin/profile/${r.profile_id}`} className="btn btn-outline btn-sm">Review</Link>
                      )}
                      <button
                        id={`btn-delete-user-${r.user_id}`}
                        className="btn btn-sm"
                        style={{ color:'#dc2626', background:'#fee2e2', border:'1px solid #fca5a5', padding:'4px 8px' }}
                        title="Permanently delete this user"
                        onClick={() => handleDelete(r.user_id, r.first_name ? `${r.first_name} ${r.surname}` : r.email)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <div style={{ textAlign:'center', padding:'var(--space-12)', color:'var(--color-text-muted)' }}>
              No submissions yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
