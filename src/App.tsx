import { useMemo } from 'react';
import data from './data.json';
import type { Account } from './types';
import COLORS from './colors';
import SummaryCards from './components/SummaryCards';
import AccountTable from './components/AccountTable';
import TikTokIcon from './components/TikTokIcon';
import './App.css';

export default function App() {
  const accounts = useMemo(() => data as Account[], []);
  const totalScraped = 307;

  const totalFollowers = accounts.reduce((s, a) => s + (parseInt(a.followers) || 0), 0);
  const withLocation = accounts.filter(a => a.location_detected).length;
  const monetized = accounts.filter(a => a.monetization === '1').length;
  const withShop = accounts.filter(a => a.has_tiktok_shop === '1').length;

  return (
    <div style={appStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <TikTokIcon size={36} />
            <div>
              <h1 style={h1Style}>Sensus Ekonomi Digital</h1>
              <p style={subtitleStyle}>Direktori Pelaku Ekonomi Digital — Kabupaten Banyumas</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Data TikTok · {new Date().toLocaleDateString('id-ID')}</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{totalScraped} akun terkumpul</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Summary */}
        <div style={heroStyle}>
          <div style={heroItemStyle}>
            <div style={heroValueStyle}>{totalScraped}</div>
            <div style={heroLabelStyle}>Total Akun</div>
          </div>
          <div style={heroDivider} />
          <div style={heroItemStyle}>
            <div style={heroValueStyle}>{formatHero(totalFollowers)}</div>
            <div style={heroLabelStyle}>Total Followers</div>
          </div>
          <div style={heroDivider} />
          <div style={heroItemStyle}>
            <div style={heroValueStyle}>{withLocation}</div>
            <div style={heroLabelStyle}>Lokasi Terdeteksi</div>
          </div>
          <div style={heroDivider} />
          <div style={heroItemStyle}>
            <div style={heroValueStyle}>{monetized}</div>
            <div style={heroLabelStyle}>Monetisasi</div>
          </div>
          <div style={heroDivider} />
          <div style={heroItemStyle}>
            <div style={heroValueStyle}>{withShop}</div>
            <div style={heroLabelStyle}>TikTok Shop</div>
          </div>
        </div>

        {/* Cards */}
        <SummaryCards accounts={accounts} totalScraped={totalScraped} />

        {/* Table */}
        <AccountTable accounts={accounts} />
      </main>

      <footer style={footerStyle}>
        Sensus Ekonomi 2026 · Data diperbarui {new Date().toLocaleDateString('id-ID')} · <a href="#" style={{ color: COLORS.orangeDark }}>Kembali ke atas</a>
      </footer>
    </div>
  );
}

function formatHero(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

const appStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: COLORS.bg,
  color: COLORS.text,
};

const headerStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${COLORS.orangeDark} 0%, ${COLORS.orange} 100%)`,
  padding: '32px 24px',
  color: COLORS.white,
  boxShadow: '0 4px 20px rgba(235,183,115,0.3)',
};

const headerInnerStyle: React.CSSProperties = {
  maxWidth: 1400,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const h1Style: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  margin: 0,
  letterSpacing: '-0.5px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  margin: '4px 0 0 0',
  opacity: 0.85,
};

const heroStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 0,
  margin: '-20px auto 28px',
  background: COLORS.white,
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  padding: '22px 0',
  maxWidth: 800,
};

const heroItemStyle: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
};

const heroValueStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: COLORS.orangeDark,
};

const heroLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: COLORS.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginTop: 4,
};

const heroDivider: React.CSSProperties = {
  width: 1,
  height: 40,
  background: COLORS.border,
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '24px',
  fontSize: 12,
  color: COLORS.textSecondary,
  borderTop: `1px solid ${COLORS.border}`,
  marginTop: 40,
};
