import { useState, useMemo } from 'react';
import type { Account } from '../types';
import COLORS from '../colors';
import TikTokIcon from './TikTokIcon';

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
    if (sortKey !== key) return '';
    return sortDir === 'desc' ? ' ▼' : ' ▲';
  };

  const resetFilters = () => {
    setSearch('');
    setFilterLocation('');
    setFilterMonetized('');
    setPage(0);
  };

  return (
    <div>
      {/* Filters */}
      <div style={filterBarStyle}>
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
        {(search || filterLocation || filterMonetized) && (
          <button onClick={resetFilters} style={resetBtnStyle}>Reset</button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
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
              <tr key={acc.username} style={trStyle}>
                <td style={tdStyle}>{page * perPage + idx + 1}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {acc.avatar_url ? (
                      <img
                        src={acc.avatar_url}
                        alt=""
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: COLORS.border }}
                        onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M72.8 19.2c-3.5-4.1-5.6-9.3-5.8-14.8h-3.2l-.1.1V43c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12c1.2 0 2.3.2 3.4.5v-3.3c-1.1-.2-2.3-.3-3.4-.3-8.6 0-15.5 6.9-15.5 15.5s6.9 15.5 15.5 15.5c7.7 0 14.1-5.6 15.3-12.9l.2-38.2c.1 0 .1 0 .2.1 2.3.6 4.5 1.6 6.4 3.1 0 0 0 0 .1.1 2.3 1.7 4.3 3.9 5.7 6.5h.1z' fill='%23EBB773' fill-rule='evenodd'/%3E%3C/svg%3E"; }}
                      />
                    ) : (
                      <TikTokIcon size={32} color="#EBB773" />
                    )}
                    <div>
                      <a href={acc.profile_url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                        @{acc.username}
                      </a>
                      {acc.verified === '1' && <span style={verifiedBadge}>✓</span>}
                      <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{acc.nickname}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  {acc.location_detected ? (
                    <span style={locBadgeStyle}>{acc.location_detected}</span>
                  ) : (
                    <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>—</span>
                  )}
                  {acc.location_source && (
                    <div style={{ fontSize: 10, color: COLORS.textSecondary, marginTop: 2 }}>({acc.location_source})</div>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 } as React.CSSProperties}>{fmt(acc.followers)}</td>
                <td style={tdStyle}>{fmt(acc.total_likes)}</td>
                <td style={tdStyle}>{fmt(acc.video_count)}</td>
                <td style={tdStyle}>{fmt(acc.average_views)}</td>
                <td style={tdStyle}>
                  {acc.engagement_rate ? (
                    <span style={{ color: COLORS.orangeDark, fontWeight: 600 }}>{parseFloat(acc.engagement_rate).toFixed(2)}%</span>
                  ) : (
                    <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>—</span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.has_tiktok_shop === '1' ? badge('Ya', COLORS.green) : badge('Tidak', COLORS.textSecondary)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.monetization === '1' ? badge('Ya', COLORS.green) : badge('Tidak', COLORS.textSecondary)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                  {acc.business_account === '1' ? badge('Ya', '#2196F3') : badge('Tidak', COLORS.textSecondary)}
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                    {acc.email && <div>📧 {acc.email}</div>}
                    {acc.website && <div>🌐 <a href={acc.website} target="_blank" style={{ color: COLORS.orangeDark }}>web</a></div>}
                    {acc.instagram && <div>📸 @{acc.instagram}</div>}
                    {acc.whatsapp && <div>💬 {acc.whatsapp}</div>}
                    {!acc.email && !acc.website && !acc.instagram && !acc.whatsapp && (
                      <span style={{ color: COLORS.textSecondary }}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={pageBtnStyle}>« Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={i === page ? pageBtnActiveStyle : pageBtnStyle}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={pageBtnStyle}>Next »</button>
        </div>
      )}
    </div>
  );
}

function fmt(val: string): string {
  const n = parseInt(val) || 0;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

function badge(text: string, color: string) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 4,
      padding: '2px 6px',
      background: `${color}10`,
    }}>
      {text}
    </span>
  );
}

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: 16,
};

const searchInputStyle: React.CSSProperties = {
  flex: '1 1 200px',
  padding: '8px 12px',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  background: COLORS.white,
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  fontSize: 13,
  background: COLORS.white,
  outline: 'none',
};

const countStyle: React.CSSProperties = {
  fontSize: 12,
  color: COLORS.textSecondary,
  marginLeft: 'auto',
};

const resetBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  border: 'none',
  borderRadius: 6,
  background: COLORS.orange,
  color: COLORS.white,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: `2px solid ${COLORS.orange}`,
  color: COLORS.textSecondary,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  letterSpacing: '0.3px',
  background: COLORS.white,
  position: 'sticky',
  top: 0,
};

const thStyleSortable: React.CSSProperties = {
  ...thStyle,
  cursor: 'pointer',
  userSelect: 'none',
};

const trStyle: React.CSSProperties = {
  borderBottom: `1px solid ${COLORS.border}`,
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  verticalAlign: 'top',
};

const linkStyle: React.CSSProperties = {
  color: COLORS.orangeDark,
  fontWeight: 600,
  textDecoration: 'none',
};

const verifiedBadge: React.CSSProperties = {
  color: '#1DA1F2',
  fontSize: 14,
  marginLeft: 4,
};

const locBadgeStyle: React.CSSProperties = {
  background: COLORS.orangeLight,
  color: COLORS.orangeDark,
  fontSize: 12,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 4,
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
  marginTop: 20,
};

const pageBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 6,
  background: COLORS.white,
  color: COLORS.textSecondary,
  fontSize: 12,
  cursor: 'pointer',
};

const pageBtnActiveStyle: React.CSSProperties = {
  ...pageBtnStyle,
  background: COLORS.orange,
  color: COLORS.white,
  borderColor: COLORS.orange,
};
