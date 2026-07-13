import type { Account } from '../types';
import COLORS from '../colors';

interface Props {
  accounts: Account[];
  totalScraped: number;
}

export default function SummaryCards({ accounts, totalScraped }: Props) {
  const withLocation = accounts.filter(a => a.location_detected).length;
  const monetized = accounts.filter(a => a.monetization === '1').length;
  const withShop = accounts.filter(a => a.has_tiktok_shop === '1').length;
  const business = accounts.filter(a => a.business_account === '1').length;
  const verified = accounts.filter(a => a.verified === '1').length;
  const withEmail = accounts.filter(a => a.email).length;
  const live = accounts.filter(a => a.live_detected === '1').length;

  const totalFollowers = accounts.reduce((sum, a) => sum + (parseInt(a.followers) || 0), 0);
  const withFollowers = accounts.filter(a => parseInt(a.followers) > 0).length;

  const cards = [
    { label: 'Total Akun', value: totalScraped, sub: `+ ${accounts.length} lokasi terdeteksi` },
    { label: 'Follower', value: formatNum(totalFollowers), sub: `${withFollowers} akun dengan follower` },
    { label: 'Lokasi Terdeteksi', value: withLocation, sub: `${((withLocation/totalScraped)*100).toFixed(0)}% dari total` },
    { label: 'Monetisasi', value: monetized, sub: `${((monetized/totalScraped)*100).toFixed(0)}% punya indikasi` },
    { label: 'TikTok Shop', value: withShop, sub: `${((withShop/totalScraped)*100).toFixed(0)}% aktif shop` },
    { label: 'Akun Bisnis', value: business, sub: `${verified} terverifikasi` },
    { label: 'Email Publik', value: withEmail, sub: `${live} live streaming` },
  ];

  return (
    <div style={gridStyle}>
      {cards.map(card => (
        <div key={card.label} style={cardStyle}>
          <div style={valueStyle}>{card.value}</div>
          <div style={labelStyle}>{card.label}</div>
          <div style={subStyle}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 16,
  marginBottom: 28,
};

const cardStyle: React.CSSProperties = {
  background: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: '18px 16px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
};

const valueStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: COLORS.orangeDark,
  lineHeight: 1.2,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.textSecondary,
  marginTop: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const subStyle: React.CSSProperties = {
  fontSize: 11,
  color: COLORS.textSecondary,
  marginTop: 6,
  opacity: 0.7,
};
