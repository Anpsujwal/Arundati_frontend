import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Shield,
  Compass,
  Briefcase,
  Users,
  Heart,
  Camera,
  Trash2,
  Check,
  AlertTriangle,
  Save,
  Loader2,
  Upload,
  Info,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';
import { profileApi } from '../../api/profile.api';
import { refApi } from '../../api/auth.api';
import { useAuth } from '../../contexts/AuthContext';
import { photoUrl, getErrorMessage } from '../../utils/format.utils';
import WeddingDivider from '../../components/wedding-theme/WeddingDivider';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Reference data
  const [gotras, setGotras] = useState([]);
  const [subsects, setSubsects] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [gotraSearch, setGotraSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1 - Basic
    first_name: '',
    surname: '',
    gender: 'Male',
    date_of_birth: '',
    marital_status: 'Never Married',
    profile_managed_by: 'Self',

    // Step 2 - Lineage
    sub_sect: '',
    gotra: '',
    pravara: '',
    maternal_gotra: '',
    maternal_inti_peru: '',
    veda: '',
    shakha: '',
    native_place: '',

    // Step 3 - Birth / Astro
    birth_time: '',
    birth_place: '',
    timezone: 'Asia/Kolkata',

    // Step 4 - Education & Career
    education: '',
    profession: '',
    employer: '',
    annual_income: '',
    hide_income: false,
    dietary_habit: 'Strict Vegetarian',
    height_cm: '',
    city: '',

    // Step 5 - Family
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_maiden_inti_peru: '',
    sibling_count: 0,
    elder_ref_1_name: '',
    elder_ref_1_phone: '',
    elder_ref_1_address: '',
    elder_ref_1_occupation: '',
    elder_ref_2_name: '',
    elder_ref_2_phone: '',
    elder_ref_2_address: '',
    elder_ref_2_occupation: '',
    elder_ref_3_name: '',
    elder_ref_3_phone: '',
    elder_ref_3_address: '',
    elder_ref_3_occupation: '',

    // Step 7 - Preferences
    pref_sub_sect: '',
    pref_location: '',
    pref_age_diff_min: '',
    pref_age_diff_max: '',
  });

  const [photos, setPhotos] = useState([]);

  // Load initial profile data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [meRes, gotrasRes, subRes, incRes] = await Promise.all([
          profileApi.me(),
          refApi.gotras().catch(() => ({ data: { data: [] } })),
          refApi.subsects().catch(() => ({ data: { data: [] } })),
          refApi.incomes().catch(() => ({ data: { data: [] } })),
        ]);

        const { profile, astro, family, photos: phList, user: u } = meRes.data.data;

        if (profile) {
          setFormData({
            first_name: profile.first_name || '',
            surname: profile.surname || '',
            gender: profile.gender || 'Male',
            date_of_birth: profile.date_of_birth ? profile.date_of_birth.substring(0, 10) : '',
            marital_status: profile.marital_status || 'Never Married',
            profile_managed_by: u?.profile_managed_by || 'Self',

            sub_sect: profile.sub_sect || '',
            gotra: profile.gotra || '',
            pravara: profile.pravara || '',
            maternal_gotra: profile.maternal_gotra || '',
            maternal_inti_peru: profile.maternal_inti_peru || '',
            veda: profile.veda || '',
            shakha: profile.shakha || '',
            native_place: profile.native_place || '',

            birth_time: astro?.birth_time || '',
            birth_place: astro?.birth_place || '',
            timezone: astro?.timezone || 'Asia/Kolkata',

            education: profile.education || '',
            profession: profile.profession || '',
            employer: profile.employer || '',
            annual_income: profile.annual_income || '',
            hide_income: Boolean(profile.hide_income),
            dietary_habit: profile.dietary_habit || 'Strict Vegetarian',
            height_cm: profile.height_cm != null ? String(profile.height_cm) : '',
            city: profile.city || '',

            father_name: family?.father_name || '',
            father_occupation: family?.father_occupation || '',
            mother_name: family?.mother_name || '',
            mother_maiden_inti_peru: family?.mother_maiden_inti_peru || '',
            sibling_count: family?.sibling_count != null ? family.sibling_count : 0,
            elder_ref_1_name: family?.elder_ref_1_name || '',
            elder_ref_1_phone: family?.elder_ref_1_phone || '',
            elder_ref_1_address: family?.elder_ref_1_address || '',
            elder_ref_1_occupation: family?.elder_ref_1_occupation || '',
            elder_ref_2_name: family?.elder_ref_2_name || '',
            elder_ref_2_phone: family?.elder_ref_2_phone || '',
            elder_ref_2_address: family?.elder_ref_2_address || '',
            elder_ref_2_occupation: family?.elder_ref_2_occupation || '',
            elder_ref_3_name: family?.elder_ref_3_name || '',
            elder_ref_3_phone: family?.elder_ref_3_phone || '',
            elder_ref_3_address: family?.elder_ref_3_address || '',
            elder_ref_3_occupation: family?.elder_ref_3_occupation || '',

            pref_sub_sect: profile.pref_sub_sect || '',
            pref_location: profile.pref_location || '',
            pref_age_diff_min: profile.pref_age_diff_min != null ? String(profile.pref_age_diff_min) : '',
            pref_age_diff_max: profile.pref_age_diff_max != null ? String(profile.pref_age_diff_max) : '',
          });
        }

        setPhotos(phList || []);
        setGotras(gotrasRes.data?.data || []);
        setSubsects(subRes.data?.data || []);
        setIncomes(incRes.data?.data || []);
      } catch (err) {
        toast.error('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await profileApi.updateProfile(formData);
      await refreshUser();
      toast.success('Profile details successfully updated!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 5) {
      toast.error('You can upload a maximum of 5 photos.');
      return;
    }

    setPhotoUploading(true);
    try {
      await profileApi.uploadPhoto(file);
      toast.success('Photo uploaded successfully!');
      const meRes = await profileApi.me();
      setPhotos(meRes.data.data.photos || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await profileApi.deletePhoto(photoId);
      toast.success('Photo deleted.');
      setPhotos((prev) => prev.filter((p) => p.photo_id !== photoId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }

    setDeleting(true);
    try {
      await profileApi.deleteAccount();
      toast.success('Your account and all associated data have been permanently removed.');
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  const filteredGotras = gotraSearch
    ? gotras.filter((g) => g.toLowerCase().includes(gotraSearch.toLowerCase()))
    : gotras;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Loading your profile details…</p>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'lineage', label: 'Lineage & Ancestry', icon: Shield },
    { id: 'birth', label: 'Birth & Kundali', icon: Compass },
    { id: 'career', label: 'Education & Career', icon: Briefcase },
    { id: 'family', label: 'Family & Elders', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: Heart },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'danger', label: 'Account Settings', icon: AlertTriangle, isDanger: true },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <Link
              to="/profile/me"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} /> Back to Profile
            </Link>
            <span className="badge badge-gold">Edit Details</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', color: 'var(--color-primary)' }}>
            Edit Profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            Keep your personal, astrological, lineage, and career details current for the best match recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
            {saving ? 'Saving Changes…' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs + Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div className="card" style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all var(--transition-fast)',
                    background: isActive
                      ? tab.isDanger
                        ? 'var(--color-error-bg)'
                        : 'linear-gradient(135deg, var(--color-primary-faint), var(--color-gold-faint))'
                      : 'transparent',
                    color: isActive
                      ? tab.isDanger
                        ? 'var(--color-error)'
                        : 'var(--color-primary)'
                      : tab.isDanger
                      ? 'var(--color-error)'
                      : 'var(--color-text)',
                    borderLeft: isActive
                      ? `3px solid ${tab.isDanger ? 'var(--color-error)' : 'var(--color-gold)'}`
                      : '3px solid transparent',
                  }}
                >
                  <Icon size={16} color={tab.isDanger ? 'var(--color-error)' : isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="card card-premium" style={{ padding: 'var(--space-8)', position: 'relative' }}>
          {/* Top subtle golden highlight */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold), var(--color-primary))' }} />

          <form onSubmit={handleSave}>
            {/* ─── TAB 1: BASIC INFO ─── */}
            {activeTab === 'basic' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <User size={20} color="var(--color-gold)" /> Basic Information
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Core identity information used across the platform.
                </p>

                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">First Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="input"
                      value={formData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Surname / Family Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="input"
                      value={formData.surname}
                      onChange={(e) => handleChange('surname', e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Gender <span className="required">*</span></label>
                    <select
                      className="select"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      className="input"
                      value={formData.date_of_birth}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Marital Status</label>
                    <select
                      className="select"
                      value={formData.marital_status}
                      onChange={(e) => handleChange('marital_status', e.target.value)}
                    >
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Profile Managed By</label>
                    <select
                      className="select"
                      value={formData.profile_managed_by}
                      onChange={(e) => handleChange('profile_managed_by', e.target.value)}
                    >
                      <option value="Self">Self</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Joint">Joint / Relative</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: LINEAGE & ANCESTRY ─── */}
            {activeTab === 'lineage' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Shield size={20} color="var(--color-gold)" /> Lineage &amp; Ancestry
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Lineage attributes are foundational for Brahmin matchmaking, Gotra exclusion, and Pravara checks.
                </p>

                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Sub-Sect</label>
                    <select
                      className="select"
                      value={formData.sub_sect}
                      onChange={(e) => handleChange('sub_sect', e.target.value)}
                    >
                      <option value="">Select Sub-Sect</option>
                      {subsects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Gotra <span className="required">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Search or enter Gotra…"
                      value={formData.gotra}
                      onChange={(e) => {
                        handleChange('gotra', e.target.value);
                        setGotraSearch(e.target.value);
                      }}
                      required
                    />
                    {gotraSearch && filteredGotras.length > 0 && formData.gotra !== gotraSearch && (
                      <div style={{
                        maxHeight: '120px', overflowY: 'auto',
                        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)', padding: 'var(--space-1)', marginTop: '2px',
                      }}>
                        {filteredGotras.slice(0, 8).map((g) => (
                          <div
                            key={g}
                            onClick={() => {
                              handleChange('gotra', g);
                              setGotraSearch('');
                            }}
                            style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Pravara</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Tryarsheya, Pancharsheya"
                      value={formData.pravara}
                      onChange={(e) => handleChange('pravara', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Native Place</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Ancestral native town / district"
                      value={formData.native_place}
                      onChange={(e) => handleChange('native_place', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Veda</label>
                    <select
                      className="select"
                      value={formData.veda}
                      onChange={(e) => handleChange('veda', e.target.value)}
                    >
                      <option value="">Select Veda</option>
                      <option value="Rigveda">Rigveda</option>
                      <option value="Yajurveda (Shukla)">Yajurveda (Shukla)</option>
                      <option value="Yajurveda (Krishna)">Yajurveda (Krishna)</option>
                      <option value="Samaveda">Samaveda</option>
                      <option value="Atharvaveda">Atharvaveda</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Shakha</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Shakala, Taittiriya, Madhyandina"
                      value={formData.shakha}
                      onChange={(e) => handleChange('shakha', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Maternal Gotra</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Mother's birth Gotra"
                      value={formData.maternal_gotra}
                      onChange={(e) => handleChange('maternal_gotra', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Maternal Inti Peru / Family Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Mother's family surname"
                      value={formData.maternal_inti_peru}
                      onChange={(e) => handleChange('maternal_inti_peru', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: BIRTH & ASTROLOGICAL ─── */}
            {activeTab === 'birth' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Compass size={20} color="var(--color-gold)" /> Birth &amp; Kundali Information
                </h2>
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-gold-faint), var(--color-surface))',
                  border: '1px solid rgba(196,147,42,0.3)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-6)',
                  display: 'flex',
                  gap: 'var(--space-3)',
                }}>
                  <Info size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    Accurate birth time and city are vital for Vedic Rasi, Lagna, Nakshatra, and Ashta Kuta compatibility matching.
                    When you update these details, your horoscope calculations will automatically be refreshed.
                  </p>
                </div>

                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Date of Birth <span className="required">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        className="input"
                        value={formData.date_of_birth}
                        onChange={(e) => handleChange('date_of_birth', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Birth Time (24-hr format)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="time"
                        className="input"
                        value={formData.birth_time}
                        onChange={(e) => handleChange('birth_time', e.target.value)}
                      />
                    </div>
                    <span className="input-hint">e.g. 06:45 or 18:30</span>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Place of Birth (City / Town)</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Hyderabad, Chennai, Bengaluru, Varanasi"
                      value={formData.birth_place}
                      onChange={(e) => handleChange('birth_place', e.target.value)}
                    />
                    <span className="input-hint">Coordinates are auto-resolved for astrological precision.</span>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Timezone</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                    />
                    <span className="input-hint">Default: Asia/Kolkata (IST)</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: EDUCATION & CAREER ─── */}
            {activeTab === 'career' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Briefcase size={20} color="var(--color-gold)" /> Education, Career &amp; Lifestyle
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Share your academic accomplishments and professional lifestyle.
                </p>

                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Highest Education</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. B.Tech (IIT), MS, MBA, CA, MBBS"
                      value={formData.education}
                      onChange={(e) => handleChange('education', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Profession / Designation</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Senior Software Architect, Doctor, Banker"
                      value={formData.profession}
                      onChange={(e) => handleChange('profession', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Current Employer / Organization</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Google, TCS, Govt. of India, Private Practice"
                      value={formData.employer}
                      onChange={(e) => handleChange('employer', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Annual Income</label>
                    <select
                      className="select"
                      value={formData.annual_income}
                      onChange={(e) => handleChange('annual_income', e.target.value)}
                    >
                      <option value="">Select Income Bracket</option>
                      {incomes.map((inc) => (
                        <option key={inc} value={inc}>{inc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.hide_income}
                        onChange={(e) => handleChange('hide_income', e.target.checked)}
                      />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                        Hide exact annual income from public candidate view (keeps it visible only upon request)
                      </span>
                    </label>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Height (in cm)</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 172"
                      value={formData.height_cm}
                      onChange={(e) => handleChange('height_cm', e.target.value)}
                    />
                    <span className="input-hint">170 cm ≈ 5 ft 7 in</span>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Current Living City</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Bengaluru, Hyderabad, Mumbai, Dallas"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Dietary Habit</label>
                    <select
                      className="select"
                      value={formData.dietary_habit}
                      onChange={(e) => handleChange('dietary_habit', e.target.value)}
                    >
                      <option value="Strict Vegetarian">Strict Vegetarian</option>
                      <option value="Sattvic">Sattvic (No onion/garlic)</option>
                      <option value="Vegan">Vegan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 5: FAMILY & REFERENCES ─── */}
            {activeTab === 'family' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Users size={20} color="var(--color-gold)" /> Family &amp; Elder References
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Family background and revered elder references verify community ties and build matrimonial trust.
                </p>

                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                  Immediate Family
                </h3>
                <div className="form-grid" style={{ marginBottom: 'var(--space-6)' }}>
                  <div className="input-group">
                    <label className="input-label">Father's Full Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.father_name}
                      onChange={(e) => handleChange('father_name', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Father's Occupation</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.father_occupation}
                      onChange={(e) => handleChange('father_occupation', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mother's Full Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.mother_name}
                      onChange={(e) => handleChange('mother_name', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Mother's Maiden Family Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.mother_maiden_inti_peru}
                      onChange={(e) => handleChange('mother_maiden_inti_peru', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Number of Siblings</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      value={formData.sibling_count}
                      onChange={(e) => handleChange('sibling_count', e.target.value)}
                    />
                  </div>
                </div>

                <WeddingDivider label="Elder References" style={{ margin: 'var(--space-6) 0' }} />

                {/* Elder Reference 1 */}
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gold-deep)', marginBottom: 'var(--space-2)' }}>
                  Elder Reference 1
                </h4>
                <div className="form-grid" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_1_name}
                      onChange={(e) => handleChange('elder_ref_1_name', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_1_phone}
                      onChange={(e) => handleChange('elder_ref_1_phone', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Address / Location</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_1_address}
                      onChange={(e) => handleChange('elder_ref_1_address', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Occupation</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_1_occupation}
                      onChange={(e) => handleChange('elder_ref_1_occupation', e.target.value)}
                    />
                  </div>
                </div>

                {/* Elder Reference 2 */}
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gold-deep)', marginBottom: 'var(--space-2)' }}>
                  Elder Reference 2
                </h4>
                <div className="form-grid" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_2_name}
                      onChange={(e) => handleChange('elder_ref_2_name', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_2_phone}
                      onChange={(e) => handleChange('elder_ref_2_phone', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Address / Location</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_2_address}
                      onChange={(e) => handleChange('elder_ref_2_address', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Occupation</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_2_occupation}
                      onChange={(e) => handleChange('elder_ref_2_occupation', e.target.value)}
                    />
                  </div>
                </div>

                {/* Elder Reference 3 */}
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gold-deep)', marginBottom: 'var(--space-2)' }}>
                  Elder Reference 3
                </h4>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_3_name}
                      onChange={(e) => handleChange('elder_ref_3_name', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_3_phone}
                      onChange={(e) => handleChange('elder_ref_3_phone', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Address / Location</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_3_address}
                      onChange={(e) => handleChange('elder_ref_3_address', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Occupation</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.elder_ref_3_occupation}
                      onChange={(e) => handleChange('elder_ref_3_occupation', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 6: PREFERENCES ─── */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Heart size={20} color="var(--color-gold)" /> Partner Preferences
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Set your alliance expectations to help our matchmaking algorithm prioritize compatible candidates.
                </p>

                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Preferred Sub-Sect</label>
                    <select
                      className="select"
                      value={formData.pref_sub_sect}
                      onChange={(e) => handleChange('pref_sub_sect', e.target.value)}
                    >
                      <option value="">Any Sub-Sect / Open</option>
                      {subsects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Preferred Location / City</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Hyderabad, Bengaluru, USA, Open to anywhere"
                      value={formData.pref_location}
                      onChange={(e) => handleChange('pref_location', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Preferred Age Difference (Min Years)</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 0"
                      value={formData.pref_age_diff_min}
                      onChange={(e) => handleChange('pref_age_diff_min', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Preferred Age Difference (Max Years)</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="e.g. 5"
                      value={formData.pref_age_diff_max}
                      onChange={(e) => handleChange('pref_age_diff_max', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 7: PHOTOS ─── */}
            {activeTab === 'photos' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Camera size={20} color="var(--color-gold)" /> Manage Profile Photos
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Upload clear, dignified photographs. You can upload up to 5 photos. The first photo is your primary display photo.
                </p>

                {/* Photo Upload Input Button */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label
                    className="btn btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: photoUploading || photos.length >= 5 ? 'not-allowed' : 'pointer',
                      opacity: photos.length >= 5 ? 0.6 : 1,
                    }}
                  >
                    {photoUploading ? <Loader2 size={16} className="spinner" /> : <Upload size={16} />}
                    {photoUploading ? 'Uploading…' : photos.length >= 5 ? 'Maximum Photos Reached (5)' : 'Upload New Photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      disabled={photoUploading || photos.length >= 5}
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <span style={{ marginLeft: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
                    JPG, PNG or WebP up to 5MB.
                  </span>
                </div>

                {/* Photo Gallery Grid */}
                {photos.length === 0 ? (
                  <div style={{
                    padding: 'var(--space-10)', textAlign: 'center',
                    border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface-2)',
                  }}>
                    <Camera size={40} color="var(--color-text-light)" style={{ margin: '0 auto var(--space-2)' }} />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                      No photos uploaded yet. Add a profile photo to increase matchmaking visibility!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                    {photos.map((p, idx) => (
                      <div
                        key={p.photo_id}
                        style={{
                          position: 'relative',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: p.is_primary ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                          aspectRatio: '1',
                          boxShadow: p.is_primary ? 'var(--shadow-gold)' : 'var(--shadow-sm)',
                        }}
                      >
                        <img
                          src={photoUrl(p.filename)}
                          alt="Profile"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {p.is_primary ? (
                          <div style={{
                            position: 'absolute', top: 6, left: 6,
                            background: 'var(--color-gold)', color: '#fff',
                            fontSize: '10px', fontWeight: 700, padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                          }}>
                            PRIMARY
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(p.photo_id)}
                          style={{
                            position: 'absolute', top: 6, right: 6,
                            background: 'rgba(198,40,40,0.85)', color: '#fff',
                            border: 'none', borderRadius: 'var(--radius-sm)',
                            width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Delete photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 8: DANGER ZONE / ACCOUNT REMOVAL ─── */}
            {activeTab === 'danger' && (
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-error)' }}>
                  <AlertTriangle size={20} color="var(--color-error)" /> Danger Zone &amp; Account Removal
                </h2>
                <div style={{
                  background: 'var(--color-error-bg)',
                  border: '1px solid rgba(198,40,40,0.3)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-6)',
                }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-error)', margin: 0, marginBottom: 'var(--space-2)' }}>
                    Permanently Delete Your Account
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
                    Once you delete your account, there is no going back. All of your personal details, photos,
                    family data, elder references, Kundali horoscope records, matches, and uploaded verification documents
                    will be <strong>permanently removed from our database</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-danger"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
                  >
                    <Trash2 size={16} /> Remove Account Permanently
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar (for editable tabs) */}
            {activeTab !== 'danger' && activeTab !== 'photos' && (
              <div style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  All updates take effect immediately in matchmaking.
                </span>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DELETE ACCOUNT CONFIRMATION MODAL
          ══════════════════════════════════════════════════════════════════ */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 'var(--space-4)',
          backdropFilter: 'blur(3px)',
        }}>
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-error)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--color-error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AlertTriangle size={22} color="var(--color-error)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-error)', margin: 0 }}>
                Delete Account Permanently?
              </h3>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-4)' }}>
              Are you sure you want to delete your account? This action is <strong>irreversible</strong>.
              All your records, lineage information, photos, Kundali calculations, and matrimonial matches will be permanently erased.
            </p>

            <div style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', display: 'block', marginBottom: 'var(--space-2)' }}>
                To confirm permanent deletion, type <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>DELETE</span> below:
              </label>
              <input
                type="text"
                className="input"
                placeholder="Type DELETE"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE' || deleting}
                onClick={handleDeleteAccount}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {deleting ? <Loader2 size={16} className="spinner" /> : <Trash2 size={16} />}
                {deleting ? 'Deleting Account…' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
