import { useState, useMemo } from 'react';
import type { Account } from '../types';
import COLORS from '../colors';
import TikTokIcon from './TikTokIcon';
import { SearchIcon, CrossIcon, MailIcon, GlobeIcon, InstagramIcon, MessageIcon, FacebookIcon } from './Icons';

interface Props {
  accounts: Account[];
}

type SortKey = 'followers' | 'engagement_rate' | 'username' | 'total_likes' | 'video_count' | 'average_views';
type SortDir = 'asc' | 'desc';

export default function AccountTable({ accounts }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('followers');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMonetized, setFilterMonetized] = useState<string>('');
  const [page, setPage] = useState(0);
  const perPage = 25;

  const locations = useMemo(() => {
    const set = new Set<string>();
    accounts.forEach(a => {
      if (a.location_detected && a.location_detected !== 'Purwokerto') set.add(a.location_detected);
    });
    return Array.from(set).sort();
  }, [accounts]);

  const filtered = useMemo(() => {
    let list = [...accounts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.username.toLowerCase().includes(q) ||
        a.nickname.toLowerCase().includes(q) ||
        (a.location_detected || '').toLowerCase().includes(q) ||
        (a.bio || '').toLowerCase().includes(q)
      );
    }
    if (filterLocation) {
      list = list.filter(a => a.location_detected === filterLocation);
    }
    if (filterMonetized === 'ya') list = list.filter(a => a.monetization === '1');
    else if (filterMonetized === 'tidak') list = list.filter(a => a.monetization !== '1');

    list.sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      if (sortKey === 'username') return dir * a.username.localeCompare(b.username);
      const va = parseFloat(a[sortKey] as string) || 0;
      const vb = parseFloat(b[sortKey] as string) || 0;
      return dir * (va - vb);
    });
    return list;
  }, [accounts, search, sortKey, sortDir, filterLocation, filterMonetized]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(page * perPage, (page + 1) * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'desc' ? ' ↓' : ' ↑';
  };

  const resetFilters = () => {
    setSearch('');
    setFilterLocation('');
    setFilterMonetized('');
    setPage(0);
  };

  const hasFilters = search || filterLocation || filterMonetized;

  return (
    <div>
      <div className="responsive-filters">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon size={16} color={COLORS.textMuted} />
        </span>
        <input
          type="text"
          placeholder="Cari username, nickname, bio, lokasi..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          style={searchInputStyle}
        />
        <select
          value={filterLocation}
          onChange={e => { setFilterLocation(e.target.value); setPage(0); }}
          style={selectStyle}
        >
          <option value="">Semua Lokasi</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={filterMonetized}
          onChange={e => { setFilterMonetized(e.target.value); setPage(0); }}
          style={selectStyle}
        >
          <option value="">Monetisasi: Semua</option>
          <option value="ya">Monetisasi: Ya</option>
          <option value="tidak">Monetisasi: Tidak</option>
        </select>
        <span style={countStyle}>{filtered.length} akun</span>
        {hasFilters && (
          <button onClick={resetFilters} style={resetBtnStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CrossIcon size={12} color={COLORS.orangeDarker} /> Reset
            </span>
          </button>
        )}
      </div>

      <div className="responsive-table-wrap">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thNumStyle}>#</th>
              <th style={thStyleSortable} onClick={() => toggleSort('username')}>Akun{sortIcon('username')}</th>
              <th style={thStyle}>Lokasi</th>
              <th style={thStyleSortable} onClick={() => toggleSort('followers')}>Followers{sortIcon('followers')}</th>
              <th style={thStyleSortable} onClick={() => toggleSort('total_likes')}>Like{sortIcon('total_likes')}</th>
              <th style={thStyleSortable} onClick={() => toggleSort('video_count')}>Video{sortIcon('video_count')}</th>
              <th style={thStyleSortable} onClick={() => toggleSort('average_views')}>Rata View{sortIcon('average_views')}</th>
              <th style={thStyleSortable} onClick={() => toggleSort('engagement_rate')}>ER{sortIcon('engagement_rate')}</th>
              <th style={thStyle}>Shop</th>
              <th style={thStyle}>Monetisasi</th>
              <th style={thStyle}>Bisnis</th>
              <th style={thStyle}>Kontak</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((acc, idx) => (
                <tr key={acc.username} className="table-row" style={trStyle()}>
                <td style={tdNumStyle}>{page * perPage + idx + 1}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {acc.avatar_url ? (
                      <img
                        src={acc.avatar_url}
                        alt=""
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: COLORS.borderLight, flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M72.8 19.2c-3.5-4.1-5.6-9.3-5.8-14.8h-3.2l-.1.1V43c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12c1.2 0 2.3.2 3.4.5v-3.3c-1.1-.2-2.3-.3-3.4-.3-8.6 0-15.5 6.9-15.5 15.5s6.9 15.5 15.5 15.5c7.7 0 14.1-5.6 15.3-12.9l.2-38.2c.1 0 .1 0 .2.1 2.3.6 4.5 1.6 6.4 3.1 0 0 0 0 .1.1 2.3 1.7 4.3 3.9 5.7 6.5h.1z' fill='%23EBB773' fill-rule='evenodd'/%3E%3C/svg%3E"; }}
                      />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.orangeLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TikTokIcon size={20} color={COLORS.orangeDark} />
                      </div>
                    )}
                    <div>
                      <a href={acc.profile_url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                        @{acc.username}
                      </a>
                      {acc.verified === '1' && <span style={verifiedBadge}>✓</span>}
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {acc.nickname || '—'}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  {acc.location_detected ? (
                    <span style={locBadgeStyle}>{acc.location_detected}</span>
                  ) : (
                    <span style={{ color: COLORS.textMuted, fontSize: 11 }}>—</span>
                  )}
                  {acc.location_source && (
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{acc.location_source}</div>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 } as React.CSSProperties}>{fmt(acc.followers)}</td>
                <td style={tdStyle}>{fmt(acc.total_likes)}</td>
                <td style={tdStyle}>{fmt(acc.video_count)}</td>
                <td style={tdStyle}>{fmt(acc.average_views)}</td>
                <td style={tdStyle}>
                  {acc.engagement_rate ? (
                    <span style={{ color: COLORS.orangeDarker, fontWeight: 700, fontSize: 13 }}>
                      {parseFloat(acc.engagement_rate).toFixed(2)}%
                    </span>
                  ) : (
                    <span style={{ color: COLORS.textMuted, fontSize: 11 }}>—</span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.has_tiktok_shop === '1' ? badge('Ya', '#059669', '#ECFDF5') : badge('Tidak', '#6b6b6b', 'rgba(107,107,107,0.063)')}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.monetization === '1' ? badge('Ya', '#059669', '#ECFDF5') : badge('Tidak', '#6b6b6b', 'rgba(107,107,107,0.063)')}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.business_account === '1' ? badge('Ya', '#2563EB', '#EFF6FF') : badge('Tidak', '#6b6b6b', 'rgba(107,107,107,0.063)')}
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: 11, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {acc.email && <ContactChip icon={MailIcon} text={acc.email} />}
                    {acc.website && <ContactChip icon={GlobeIcon} text={<a href={acc.website} target="_blank" style={{ color: COLORS.orangeDark, fontWeight: 600 }}>Website</a>} />}
                    {acc.instagram && <ContactChip icon={InstagramIcon} text={`@${acc.instagram}`} />}
                    {acc.whatsapp && <ContactChip icon={MessageIcon} text={acc.whatsapp} />}
                    {acc.facebook && <ContactChip icon={FacebookIcon} text={acc.facebook} />}
                    {!acc.email && !acc.website && !acc.instagram && !acc.whatsapp && !acc.facebook && (
                      <span style={{ color: COLORS.textMuted }}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: 40, color: COLORS.textMuted }}>
                  <div style={{ marginBottom: 8, opacity: 0.5 }}><SearchIcon size={32} color={COLORS.textMuted} /></div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Tidak ada akun ditemukan</div>
                  <div style={{ fontSize: 12 }}>Coba ubah filter atau kata kunci pencarian</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="responsive-pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={pageBtnStyle}
          >
            ‹ Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 15) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={i === page ? pageBtnActiveStyle : pageBtnStyle}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 15 && <span style={{ color: COLORS.textMuted, fontSize: 12 }}>...</span>}
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            style={pageBtnStyle}
          >
            Next ›
          </button>
          <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>
            Halaman {page + 1} dari {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

function ContactChip({ icon: Icon, text }: { icon: React.ComponentType<{size: number; color: string}>; text: string | React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
      <Icon size={12} color={COLORS.textMuted} />
      {typeof text === 'string' ? (
        <span style={{ color: COLORS.textSecondary, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{text}</span>
      ) : text}
    </span>
  );
}

function fmt(val: string): string {
  const n = parseInt(val) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

function badge(text: string, color: string, bg: string) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color,
      background: bg,
      borderRadius: 6,
      padding: '3px 8px',
      display: 'inline-block',
      lineHeight: 1.3,
    }}>
      {text}
    </span>
  );
}

const searchInputStyle: React.CSSProperties = {
  flex: '1 1 220px',
  padding: '8px 12px',
  border: '1px solid #E5E0D6',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  background: '#fff',
  color: '#2d2d2d',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #E5E0D6',
  borderRadius: 8,
  fontSize: 13,
  background: '#fff',
  outline: 'none',
  color: '#2d2d2d',
  cursor: 'pointer',
  minWidth: 140,
};

const countStyle: React.CSSProperties = {
  fontSize: 12,
  color: COLORS.textMuted,
  fontWeight: 500,
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
};

const resetBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  border: '1px solid #d49545',
  borderRadius: 8,
  background: '#fff3e0',
  color: '#d49545',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '1px solid #E5E0D6',
  color: '#6b6b6b',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  letterSpacing: '0.4px',
  background: '#fff',
  position: 'sticky',
  top: 0,
  userSelect: 'none',
};

const thNumStyle: React.CSSProperties = {
  ...thStyle,
  width: 36,
  textAlign: 'center',
};

const thStyleSortable: React.CSSProperties = {
  ...thStyle,
  cursor: 'pointer',
};

const trStyle = (): React.CSSProperties => ({
  borderBottom: '1px solid #F0EDE8',
  background: '#fff',
});

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  verticalAlign: 'middle',
};

const tdNumStyle: React.CSSProperties = {
  ...tdStyle,
  textAlign: 'center',
  color: COLORS.textMuted,
  fontSize: 11,
  fontWeight: 500,
};

const linkStyle: React.CSSProperties = {
  color: COLORS.orangeDarker,
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: 13,
};

const verifiedBadge: React.CSSProperties = {
  color: '#1DA1F2',
  fontSize: 13,
  marginLeft: 3,
};

const locBadgeStyle: React.CSSProperties = {
  background: COLORS.orangeLight,
  color: COLORS.orangeDarker,
  fontSize: 12,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 6,
  display: 'inline-block',
};

const pageBtnStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #E5E0D6',
  borderRadius: 6,
  background: '#fff',
  color: '#6b6b6b',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  minWidth: 32,
  textAlign: 'center',
};

const pageBtnActiveStyle: React.CSSProperties = {
  ...pageBtnStyle,
  background: '#d49545',
  color: '#fff',
  borderColor: '#d49545',
  fontWeight: 600,
};
