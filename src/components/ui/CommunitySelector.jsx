import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, X, Check, AlertCircle } from 'lucide-react';
import { communityApi } from '../../api/community.api';

/**
 * CommunitySelector
 *
 * A two-level cascading community selector with unified search.
 *
 * Props:
 *   primarySect       {string}   — current Primary Sect name value
 *   subSect           {string}   — current Sub-Sect name value
 *   primarySectId     {number}   — current Primary Sect DB id
 *   subSectId         {number}   — current Sub-Sect DB id
 *   onChangePrimary   {fn}       — called with (id, name, slug) when Primary Sect changes
 *   onChangeSubSect   {fn}       — called with (id, name, slug) when Sub-Sect changes
 *   error             {string}   — external validation error message
 *   required          {boolean}  — marks field as required
 *   disabled          {boolean}  — disables both fields
 *   customMode        {boolean}  — whether "Other / Not Listed" is selected (shows text input)
 *   onCustomChange    {fn}       — called with custom text value
 *   customValue       {string}   — value of custom text input
 */
export default function CommunitySelector({
  primarySect = '',
  subSect = '',
  primarySectId = null,
  subSectId = null,
  onChangePrimary,
  onChangeSubSect,
  error,
  required = false,
  disabled = false,
  customMode = false,
  onCustomChange,
  customValue = '',
}) {
  // ── Data State ────────────────────────────────────────────────────────────
  const [sects, setSects] = useState([]);
  const [subSects, setSubSects] = useState([]);
  const [loadingSects, setLoadingSects] = useState(true);
  const [loadingSubSects, setLoadingSubSects] = useState(false);

  // ── Search State ──────────────────────────────────────────────────────────
  const [unifiedSearch, setUnifiedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // ── Dropdown State ────────────────────────────────────────────────────────
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [subFilter, setSubFilter] = useState('');

  // ── Refs ──────────────────────────────────────────────────────────────────
  const searchRef = useRef(null);
  const primaryRef = useRef(null);
  const subRef = useRef(null);
  const searchDebounce = useRef(null);

  // ── Load Primary Sects on mount ───────────────────────────────────────────
  useEffect(() => {
    communityApi.getSects()
      .then((r) => setSects(r.data.data || []))
      .catch(() => setSects([]))
      .finally(() => setLoadingSects(false));
  }, []);

  // ── Load Sub-Sects when primarySectId changes ─────────────────────────────
  useEffect(() => {
    if (!primarySectId) {
      setSubSects([]);
      return;
    }
    setLoadingSubSects(true);
    communityApi.getSubSects(primarySectId)
      .then((r) => setSubSects(r.data.data?.subSects || []))
      .catch(() => setSubSects([]))
      .finally(() => setLoadingSubSects(false));
  }, [primarySectId]);

  // ── Unified search debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (!unifiedSearch.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(async () => {
      try {
        const r = await communityApi.search(unifiedSearch);
        setSearchResults(r.data.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 280);
    return () => clearTimeout(searchDebounce.current);
  }, [unifiedSearch]);

  // ── Click outside to close dropdowns ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (primaryRef.current && !primaryRef.current.contains(e.target)) setPrimaryOpen(false);
      if (subRef.current && !subRef.current.contains(e.target)) setSubOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handlePrimarySelect = useCallback((sect) => {
    if (sect.name === 'Other / Not Listed') {
      onChangePrimary && onChangePrimary(null, 'Other / Not Listed', 'other-not-listed');
      onChangeSubSect && onChangeSubSect(null, '', '');
    } else {
      onChangePrimary && onChangePrimary(sect.id, sect.name, sect.slug);
      onChangeSubSect && onChangeSubSect(null, '', '');
    }
    setPrimaryOpen(false);
    setPrimaryFilter('');
    setSubFilter('');
  }, [onChangePrimary, onChangeSubSect]);

  const handleSubSectSelect = useCallback((sub) => {
    if (sub.name === 'Other / Not Listed') {
      onChangeSubSect && onChangeSubSect(null, 'Other / Not Listed', 'other-not-listed');
    } else {
      onChangeSubSect && onChangeSubSect(sub.id, sub.name, sub.slug);
    }
    setSubOpen(false);
    setSubFilter('');
  }, [onChangeSubSect]);

  const handleSearchResultSelect = useCallback((result) => {
    if (result.categoryLevel === 1) {
      // Selected a Primary Sect directly
      onChangePrimary && onChangePrimary(result.id, result.name, result.slug);
      onChangeSubSect && onChangeSubSect(null, '', '');
    } else {
      // Selected a Sub-Sect — auto-populate both
      onChangePrimary && onChangePrimary(result.primarySectId, result.primarySectName, result.primarySectSlug);
      onChangeSubSect && onChangeSubSect(result.id, result.name, result.slug);
    }
    setUnifiedSearch('');
    setSearchResults([]);
    setShowSearch(false);
  }, [onChangePrimary, onChangeSubSect]);

  const clearAll = useCallback(() => {
    onChangePrimary && onChangePrimary(null, '', '');
    onChangeSubSect && onChangeSubSect(null, '', '');
    setUnifiedSearch('');
    setSearchResults([]);
  }, [onChangePrimary, onChangeSubSect]);

  // ── Computed values ───────────────────────────────────────────────────────

  const filteredSects = primaryFilter
    ? sects.filter((s) => s.name.toLowerCase().includes(primaryFilter.toLowerCase()))
    : sects;

  const filteredSubSects = subFilter
    ? subSects.filter((s) => s.name.toLowerCase().includes(subFilter.toLowerCase()))
    : subSects;

  const isOtherPrimary = primarySect === 'Other / Not Listed';
  const isOtherSubSect = subSect === 'Other / Not Listed';
  const showSubField = !!primarySectId && !isOtherPrimary;
  const showPreview = (primarySect && primarySect !== '') || (subSect && subSect !== '');

  // ── Styles ────────────────────────────────────────────────────────────────

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 8px 24px rgba(123,29,58,0.12)',
    zIndex: 200,
    maxHeight: '240px',
    overflowY: 'auto',
  };

  const dropdownItemStyle = (isSelected) => ({
    padding: 'var(--space-3) var(--space-4)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
    background: isSelected ? 'var(--color-primary-faint)' : 'transparent',
    fontWeight: isSelected ? 600 : 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-2)',
    transition: 'background 0.15s',
    borderBottom: '1px solid rgba(237,217,184,0.4)',
  });

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    border: error ? '1.5px solid var(--color-error)' : '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    background: disabled ? 'var(--color-surface-2)' : 'var(--color-surface)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

      {/* ── Unified Search ─────────────────────────────────────────────────── */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <label
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          🔍 Quick Search (optional)
        </label>
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={unifiedSearch}
            placeholder="Search your Primary Sect or Sub-Sect…  e.g. Havyaka, Velanadu, Vadakalai"
            disabled={disabled}
            onChange={(e) => {
              setUnifiedSearch(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            style={{
              ...inputStyle,
              paddingLeft: '36px',
              paddingRight: unifiedSearch ? '36px' : 'var(--space-4)',
            }}
          />
          {unifiedSearch && (
            <button
              type="button"
              onClick={() => { setUnifiedSearch(''); setSearchResults([]); }}
              style={{
                position: 'absolute', right: '10px', top: '50%',
                transform: 'translateY(-50%)', border: 'none',
                background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                padding: '2px', display: 'flex', alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearch && unifiedSearch.trim() && (
          <div style={dropdownStyle}>
            {searchLoading ? (
              <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                Searching…
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                No results found for "{unifiedSearch}"
              </div>
            ) : (
              searchResults.map((r) => (
                <div
                  key={`${r.categoryLevel}-${r.id}`}
                  style={dropdownItemStyle(false)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-faint)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearchResultSelect(r);
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: r.categoryLevel === 1 ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {r.name}
                    </span>
                    {r.categoryLevel === 2 && (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginLeft: 'var(--space-2)' }}>
                        under <strong>{r.primarySectName}</strong>
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: 'var(--text-xs)', padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: r.categoryLevel === 1 ? 'rgba(123,29,58,0.1)' : 'rgba(196,147,42,0.1)',
                    color: r.categoryLevel === 1 ? 'var(--color-primary)' : 'var(--color-gold-deep)',
                    fontWeight: 600, whiteSpace: 'nowrap',
                  }}>
                    {r.categoryLevel === 1 ? 'Primary Sect' : 'Sub-Sect'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── OR divider ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        color: 'var(--color-text-light)', fontSize: 'var(--text-xs)',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        <span>or select manually below</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
      </div>

      {/* ── Field 1: Primary Sect ─────────────────────────────────────────── */}
      <div ref={primaryRef} style={{ position: 'relative' }}>
        <label
          className="input-label"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
        >
          Primary Sect
          {required && <span className="required">*</span>}
        </label>

        <div
          role="combobox"
          aria-expanded={primaryOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && (setPrimaryOpen((o) => !o), setSubOpen(false), setPrimaryFilter(''))}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPrimaryOpen((o) => !o); } }}
          style={{
            ...inputStyle,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            userSelect: 'none',
            borderColor: error ? 'var(--color-error)' : primarySect ? 'var(--color-border-strong)' : 'var(--color-border)',
            boxShadow: primaryOpen ? '0 0 0 3px rgba(196,147,42,0.15)' : 'none',
          }}
        >
          <span style={{ color: primarySect ? 'var(--color-text)' : 'var(--color-text-light)', fontWeight: primarySect ? 500 : 400 }}>
            {loadingSects ? 'Loading…' : (primarySect || 'Select Primary Sect')}
          </span>
          {primaryOpen ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
        </div>

        {primaryOpen && (
          <div style={dropdownStyle}>
            {/* Search within Primary Sect */}
            <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1 }}>
              <input
                autoFocus
                type="text"
                placeholder="Filter Primary Sects…"
                value={primaryFilter}
                onChange={(e) => setPrimaryFilter(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%', padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            {filteredSects.map((s) => (
              <div
                key={s.id}
                role="option"
                aria-selected={s.id === primarySectId}
                style={dropdownItemStyle(s.id === primarySectId)}
                onMouseEnter={(e) => { if (s.id !== primarySectId) e.currentTarget.style.background = 'var(--color-primary-faint)'; }}
                onMouseLeave={(e) => { if (s.id !== primarySectId) e.currentTarget.style.background = 'transparent'; }}
                onMouseDown={(e) => { e.preventDefault(); handlePrimarySelect(s); }}
              >
                <span>{s.name}</span>
                {s.id === primarySectId && <Check size={14} color="var(--color-primary)" />}
              </div>
            ))}
            {/* Other / Not Listed */}
            <div
              role="option"
              style={{
                ...dropdownItemStyle(isOtherPrimary),
                borderTop: '1px solid var(--color-border)',
                color: isOtherPrimary ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontStyle: 'italic',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-faint)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isOtherPrimary ? 'var(--color-primary-faint)' : 'transparent'; }}
              onMouseDown={(e) => { e.preventDefault(); handlePrimarySelect({ id: null, name: 'Other / Not Listed', slug: 'other-not-listed' }); }}
            >
              <span>Other / Not Listed</span>
              {isOtherPrimary && <Check size={14} color="var(--color-primary)" />}
            </div>
          </div>
        )}
      </div>

      {/* ── Custom Primary Sect Input ─────────────────────────────────────── */}
      {isOtherPrimary && (
        <div className="input-group">
          <label className="input-label">Describe your Primary Sect / Community</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your community name…"
            value={customValue}
            onChange={(e) => onCustomChange && onCustomChange(e.target.value)}
            disabled={disabled}
          />
          <p className="input-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-warning)' }}>
            <AlertCircle size={12} />
            This will be submitted for admin review and is not added to the official list automatically.
          </p>
        </div>
      )}

      {/* ── Field 2: Sub-Sect / Local Lineage ────────────────────────────── */}
      {!isOtherPrimary && (
        <div ref={subRef} style={{ position: 'relative' }}>
          <label className="input-label">
            Sub-Sect / Local Lineage
            {required && <span className="required">*</span>}
          </label>

          <div
            role="combobox"
            aria-expanded={subOpen}
            aria-haspopup="listbox"
            aria-disabled={!showSubField || disabled}
            tabIndex={!showSubField || disabled ? -1 : 0}
            onClick={() => { if (showSubField && !disabled) { setSubOpen((o) => !o); setPrimaryOpen(false); setSubFilter(''); } }}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && showSubField && !disabled) { e.preventDefault(); setSubOpen((o) => !o); } }}
            style={{
              ...inputStyle,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              userSelect: 'none',
              opacity: !showSubField ? 0.55 : 1,
              cursor: !showSubField || disabled ? 'not-allowed' : 'pointer',
              borderColor: subSect ? 'var(--color-border-strong)' : 'var(--color-border)',
              boxShadow: subOpen ? '0 0 0 3px rgba(196,147,42,0.15)' : 'none',
            }}
          >
            <span style={{ color: subSect ? 'var(--color-text)' : 'var(--color-text-light)', fontWeight: subSect ? 500 : 400 }}>
              {!showSubField
                ? 'Select a Primary Sect first'
                : loadingSubSects
                  ? 'Loading sub-sects…'
                  : (subSect || 'Select Sub-Sect / Local Lineage')}
            </span>
            {subOpen ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
          </div>

          {subOpen && showSubField && (
            <div style={dropdownStyle}>
              {/* Filter within Sub-Sects */}
              <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1 }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Filter Sub-Sects…"
                  value={subFilter}
                  onChange={(e) => setSubFilter(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%', padding: 'var(--space-2) var(--space-3)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)', outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
              {filteredSubSects.length === 0 && !loadingSubSects ? (
                <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                  No sub-sects found
                </div>
              ) : (
                filteredSubSects.map((s) => (
                  <div
                    key={s.id}
                    role="option"
                    aria-selected={s.id === subSectId}
                    style={dropdownItemStyle(s.id === subSectId)}
                    onMouseEnter={(e) => { if (s.id !== subSectId) e.currentTarget.style.background = 'var(--color-primary-faint)'; }}
                    onMouseLeave={(e) => { if (s.id !== subSectId) e.currentTarget.style.background = 'transparent'; }}
                    onMouseDown={(e) => { e.preventDefault(); handleSubSectSelect(s); }}
                  >
                    <span>{s.name}</span>
                    {s.id === subSectId && <Check size={14} color="var(--color-primary)" />}
                  </div>
                ))
              )}
              {/* Other / Not Listed for Sub-Sect */}
              <div
                role="option"
                style={{
                  ...dropdownItemStyle(isOtherSubSect),
                  borderTop: '1px solid var(--color-border)',
                  color: isOtherSubSect ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontStyle: 'italic',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-faint)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isOtherSubSect ? 'var(--color-primary-faint)' : 'transparent'; }}
                onMouseDown={(e) => { e.preventDefault(); handleSubSectSelect({ id: null, name: 'Other / Not Listed', slug: 'other-not-listed' }); }}
              >
                <span>Other / Not Listed</span>
                {isOtherSubSect && <Check size={14} color="var(--color-primary)" />}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Custom Sub-Sect Input ─────────────────────────────────────────── */}
      {isOtherSubSect && !isOtherPrimary && (
        <div className="input-group">
          <label className="input-label">Describe your Sub-Sect / Local Lineage</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your sub-sect / lineage name…"
            value={customValue}
            onChange={(e) => onCustomChange && onCustomChange(e.target.value)}
            disabled={disabled}
          />
          <p className="input-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-warning)' }}>
            <AlertCircle size={12} />
            This will be submitted for admin review and is not added to the official list automatically.
          </p>
        </div>
      )}

      {/* ── Error message ─────────────────────────────────────────────────── */}
      {error && (
        <p className="input-error-msg" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', margin: 0 }}>
          <AlertCircle size={13} />
          {error}
        </p>
      )}

      {/* ── Selection Preview ─────────────────────────────────────────────── */}
      {showPreview && !isOtherPrimary && !isOtherSubSect && (
        <div style={{
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'linear-gradient(135deg, rgba(196,147,42,0.06) 0%, rgba(123,29,58,0.04) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your Selection
            </div>
            <div style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {primarySect && (
                <span style={{
                  background: 'rgba(123,29,58,0.08)', color: 'var(--color-primary)',
                  padding: '2px 10px', borderRadius: 'var(--radius-full)',
                  fontWeight: 600, fontSize: 'var(--text-xs)',
                }}>
                  {primarySect}
                </span>
              )}
              {subSect && subSect !== 'Other / Not Listed' && (
                <>
                  <span style={{ color: 'var(--color-text-muted)' }}>›</span>
                  <span style={{
                    background: 'rgba(196,147,42,0.1)', color: 'var(--color-gold-deep)',
                    padding: '2px 10px', borderRadius: 'var(--radius-full)',
                    fontWeight: 600, fontSize: 'var(--text-xs)',
                  }}>
                    {subSect}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={clearAll}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)',
              display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
              fontFamily: 'var(--font-body)',
            }}
            title="Clear selection"
          >
            <X size={12} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
