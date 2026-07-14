import type { Account } from '../types';
import COLORS from '../colors';
import { UsersIcon, HeartIcon, PinIcon, BriefcaseIcon, ShopIcon, BuildingIcon, MailIcon } from './Icons';

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
    { Icon: UsersIcon, label: 'Total Akun', value: totalScraped, sub: `${accounts.length} data terkumpul`, color: COLORS.orangeDarker, bg: COLORS.orangeLight },
    { Icon: HeartIcon, label: 'Total Followers', value: formatNum(totalFollowers), sub: `${withFollowers} akun punya follower`, color: '#DC2626', bg: '#FEF2F2' },
    { Icon: PinIcon, label: 'Lokasi Terdeteksi', value: withLocation, sub: `${((withLocation/totalScraped)*100).toFixed(0)}% dari total`, color: COLORS.blue, bg: COLORS.blueLight },
    { Icon: BriefcaseIcon, label: 'Monetisasi', value: monetized, sub: `${((monetized/totalScraped)*100).toFixed(0)}% indikasi`, color: COLORS.purple, bg: COLORS.purpleLight },
    { Icon: ShopIcon, label: 'TikTok Shop', value: withShop, sub: `${((withShop/totalScraped)*100).toFixed(0)}% aktif`, color: '#059669', bg: '#ECFDF5' },
    { Icon: BuildingIcon, label: 'Akun Bisnis', value: business, sub: `${verified} terverifikasi`, color: '#2563EB', bg: '#EFF6FF' },
    { Icon: MailIcon, label: 'Email Publik', value: withEmail, sub: `${live} live streaming`, color: '#7C3AED', bg: '#F5F3FF' },
  ];

  return (
    <div className="responsive-cards">
      {cards.map(card => {
        const Icon = card.Icon;
        return (
          <div key={card.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ ...iconWrapStyle, background: card.bg, color: card.color }}>
                <Icon size={18} />
              </span>
              <span style={labelStyle}>{card.label}</span>
            </div>
            <div style={{ ...valueStyle, color: card.color }}>{card.value}</div>
            <div style={subStyle}>{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

const cardStyle: React.CSSProperties = {
  background: COLORS.white,
  borderRadius: 12,
  padding: '18px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: `1px solid ${COLORS.borderLight}`,
};

const iconWrapStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const valueStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.2,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.textSecondary,
};

const subStyle: React.CSSProperties = {
  fontSize: 11,
  color: COLORS.textMuted,
  marginTop: 4,
};
