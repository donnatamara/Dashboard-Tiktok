import { useMemo } from 'react';
import data from './data.json';
import type { Account } from './types';
import AccountTable from './components/AccountTable';
import Logo from './components/Logo';
import COLORS from './colors';
import './App.css';
import './responsive.css';

export default function App() {
  const accounts = useMemo(() => data as Account[], []);
  const totalScraped = accounts.length;
  const totalFollowers = accounts.reduce((s, a) => s + (parseInt(a.followers) || 0), 0);
  const withLocation = accounts.filter(a => a.location_detected).length;
  const monetized = accounts.filter(a => a.monetization === '1').length;
  const withShop = accounts.filter(a => a.has_tiktok_shop === '1').length;
  const totalLikes = accounts.reduce((s, a) => s + (parseInt(a.total_likes) || 0), 0);
  const totalVideos = accounts.reduce((s, a) => s + (parseInt(a.video_count) || 0), 0);
  const avgViews = Math.round(accounts.reduce((s, a) => s + (parseInt(a.average_views) || 0), 0) / Math.max(1, accounts.filter(a => parseInt(a.average_views) > 0).length));
  const avgER = accounts.reduce((s, a) => s + (parseFloat(a.engagement_rate) || 0), 0) / Math.max(1, accounts.filter(a => parseFloat(a.engagement_rate) > 0).length);
  const verified = accounts.filter(a => a.verified === '1').length;
  const affiliateCount = accounts.filter(a => a.classification === 'affiliate').length;
  const foodvlogerCount = accounts.filter(a => a.classification === 'foodvloger').length;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: 'Inter, Segoe UI, system-ui, sans-serif' }}>
      <header className="app-header" style={{ background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.gold} 100%)`, padding: '32px 24px', color: '#fff', boxShadow: `${COLORS.primary}33 0px 4px 20px` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <Logo size={36} />
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>SIPEKA</h1>
              <p style={{ fontSize: 14, margin: '4px 0 0', opacity: 0.85 }}>Sistem Informasi Pemetaan Kreator Banyumas</p>
            </div>
          </div>
          <div className="header-right" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Data TikTok · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{totalScraped} akun terkumpul</div>
          </div>
        </div>
      </header>

      <main className="app-main" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {/* Stats row - overlapping the header */}
        <div className="stats-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, margin: '-20px auto 28px', background: COLORS.white, borderRadius: 16, boxShadow: `${COLORS.shadow} 0px 4px 24px`, padding: '22px 0', maxWidth: 800 }}>
          <StatItem value={totalScraped} label="Total Akun" />
          <div className="stat-divider" style={{ width: 1, height: 40, background: COLORS.border }} />
          <StatItem value={formatNum(totalFollowers)} label="Total Followers" />
          <div className="stat-divider" style={{ width: 1, height: 40, background: COLORS.border }} />
          <StatItem value={withLocation} label="Lokasi Terdeteksi" />
          <div className="stat-divider" style={{ width: 1, height: 40, background: COLORS.border }} />
          <StatItem value={monetized} label="Monetisasi" />
          <div className="stat-divider" style={{ width: 1, height: 40, background: COLORS.border }} />
          <StatItem value={withShop} label="TikTok Shop" />
        </div>

        {/* Summary cards grid — no overlap with stats row above */}
        <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16, marginBottom: 28 }}>
          <SummaryCard value={formatNum(totalLikes)} label="Total Likes" sub={`${accounts.filter(a => parseInt(a.total_likes) > 0).length} akun dengan like`} accent={COLORS.primary} />
          <SummaryCard value={formatNum(totalVideos)} label="Total Video" sub={`${Math.round(totalVideos / Math.max(1, totalScraped))} video/akun`} accent={COLORS.gold} />
          <SummaryCard value={formatNum(avgViews)} label="Rata-rata Views" sub="per video" accent={COLORS.primary} />
          <SummaryCard value={avgER.toFixed(2) + '%'} label="Rata-rata ER" sub={`${accounts.filter(a => parseFloat(a.engagement_rate) > 0).length} akun terhitung`} accent={COLORS.gold} />
          <SummaryCard value={verified} label="Terverifikasi" sub={`${((verified/totalScraped)*100).toFixed(1)}% dari total`} accent={COLORS.primary} />
          <SummaryCard value={affiliateCount} label="Affiliate" sub={`${((affiliateCount/totalScraped)*100).toFixed(1)}% dari total`} accent={COLORS.gold} />
          <SummaryCard value={foodvlogerCount} label="Foodvloger" sub={`${((foodvlogerCount/totalScraped)*100).toFixed(1)}% dari total`} accent={COLORS.primary} />
        </div>

        <AccountTable accounts={accounts} />
      </main>

      <footer style={{ textAlign: 'center', padding: 24, marginTop: 40, fontSize: 12, color: COLORS.textSecondary }}>
        SIPEKA · Data diperbarui {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })} · <a href="#root" style={{ color: COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>Kembali ke atas</a>
      </footer>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + ' rb';
  return n.toString();
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div className="stat-item-value" style={{ fontSize: 32, fontWeight: 700, color: COLORS.primary }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SummaryCard({ value, label, sub, accent }: { value: string | number; label: string; sub: string; accent?: string }) {
  return (
    <div className="summary-card" style={{ background: COLORS.cardBg, borderRadius: 12, padding: '18px 16px', boxShadow: `0 1px 2px ${COLORS.shadow}` }}>
      <div className="summary-card-value" style={{ fontSize: 24, fontWeight: 700, color: accent || COLORS.primary, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 600, marginTop: 4 }}>{label}</div>
      <div className="summary-card-sub" style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>
    </div>
  );
}
