import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search, Copy, QrCode, Facebook, Linkedin,
  MessageCircle, Twitter, Mail, CheckCircle,
  Clock, Link2, AlertCircle, Gift, Users,
  DollarSign, Sparkles, Share2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CurrentUser {
  user_id: number;
  email: string;
  referral_code: string;
  display_name?: string;
  profile_image_url?: string;
}

interface Referral {
  referral_id: string;
  referral_code_used: string;
  status: 'pending' | 'completed' | 'rewarded' | string;
  reward_amount: number;
  created_at: string;
  rewarded_at: string | null;
  referred_email?: string;
  referred_display_name?: string;
  referred_profile_image_url?: string;
}

interface ReferralsResponse {
  referrals: Referral[];
  summary: {
    total: number;
    rewarded_count: number;
    completed_count: number;
    total_earned: number;
  };
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(r => {
    if (!r.ok) throw new Error('API error');
    return r.json();
  });

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<string, { color: string; label: string }> = {
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',      label: 'Pending'   },
  completed: { color: 'bg-blue-50 text-blue-700 border-blue-200',         label: 'Completed' },
  rewarded:  { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Rewarded'  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ src, name, size = 'md' }: {
  src?: string | null; name?: string | null; size?: 'sm' | 'md' | 'lg';
}) {
  const dim =
    size === 'sm' ? 'w-8 h-8 text-xs'
    : size === 'lg' ? 'w-16 h-16 text-xl'
    : 'w-10 h-10 text-sm';

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'User'}
        className={`${dim} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-white shadow-sm flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ReferralsPage() {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQR,       setShowQR]       = useState(false);
  const [copied,       setCopied]       = useState(false);

  const { data: currentUser, isLoading: userLoading, error: userError } =
    useSWR<CurrentUser>('/api/referrals/userMe', fetcher);

  const { data: referralsData, isLoading: referralsLoading, error: referralsError } =
    useSWR<ReferralsResponse>(currentUser ? '/api/referrals/otherDetails' : null, fetcher);

  const referrals = referralsData?.referrals ?? [];
  const summary   = referralsData?.summary;
  const code      = currentUser?.referral_code ?? '';

  const filtered = referrals.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      r.referral_code_used.toLowerCase().includes(q) ||
      r.referred_email?.toLowerCase().includes(q) ||
      r.referred_display_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const msg = encodeURIComponent(`Use my referral code ${code} to sign up!`);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${msg}`,
      twitter:  `https://twitter.com/intent/tweet?text=${msg}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?summary=${msg}`,
      whatsapp: `https://wa.me/?text=${msg}`,
      email:    `mailto:?subject=Join me!&body=${decodeURIComponent(msg)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  if (userError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-slate-600 font-medium">Failed to load. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-950 to-blue-950 p-6 md:p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/[0.03] rounded-full blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-8">

          <div className="flex items-center gap-4">
            {userLoading
              ? <Skeleton className="w-16 h-16 rounded-full bg-white/10" />
              : <Avatar src={currentUser?.profile_image_url} name={currentUser?.display_name} size="lg" />
            }
            <div>
              {userLoading ? (
                <>
                  <Skeleton className="h-5 w-36 mb-2 bg-white/10 rounded" />
                  <Skeleton className="h-4 w-48 bg-white/10 rounded" />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold tracking-tight">
                    {currentUser?.display_name ?? 'Your Account'}
                  </h2>
                  <p className="text-indigo-300/80 text-sm mt-0.5">{currentUser?.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="md:ml-auto flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold tracking-[0.18em] text-blue-300/80 uppercase">
                Your Referral Code
              </span>
            </div>

            {userLoading ? (
              <Skeleton className="h-16 w-56 rounded-2xl bg-white/10" />
            ) : (
              <div className="flex items-stretch gap-3">
                <div className="relative group cursor-default">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-500 blur opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="relative px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center">
                    <span className="font-mono text-3xl font-black tracking-[0.25em] text-white drop-shadow-lg">
                      {code || '------'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!code}
                    className="flex-1 flex items-center gap-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all active:scale-95 disabled:opacity-30 text-sm font-medium"
                  >
                    {copied
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <Copy className="w-4 h-4" />
                    }
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => setShowQR(v => !v)}
                    disabled={!code}
                    className="flex-1 flex items-center gap-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all active:scale-95 disabled:opacity-30 text-sm font-medium"
                  >
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-indigo-400/70" />
              <span className="text-xs text-indigo-400/70">Share:</span>
              {[
                { id: 'facebook', icon: <Facebook   className="w-3.5 h-3.5" />, hover: 'hover:bg-blue-600/40'  },
                { id: 'twitter',  icon: <Twitter    className="w-3.5 h-3.5" />, hover: 'hover:bg-sky-500/40'   },
                { id: 'linkedin', icon: <Linkedin   className="w-3.5 h-3.5" />, hover: 'hover:bg-blue-700/40'  },
                { id: 'whatsapp', icon: <MessageCircle className="w-3.5 h-3.5" />, hover: 'hover:bg-green-600/40' },
                { id: 'email',    icon: <Mail       className="w-3.5 h-3.5" />, hover: 'hover:bg-slate-500/40' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => handleShare(s.id)}
                  disabled={!code}
                  className={`p-2 rounded-lg bg-white/10 border border-white/10 text-white transition-colors ${s.hover} disabled:opacity-30`}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR panel */}
        {showQR && code && (
          <div className="relative mt-6 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-white rounded-2xl p-5 shadow-2xl inline-flex flex-col items-center gap-2">
              <QRCodeSVG value={code} size={156} />
              <p className="text-slate-500 text-xs font-mono tracking-widest">{code}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: <Users className="w-5 h-5 text-indigo-500" />,
            label: 'Total Referred',
            value: summary?.total,
            bg: 'bg-indigo-50',
          },
          {
            icon: <Gift className="w-5 h-5 text-violet-500" />,
            label: 'Rewarded',
            value: summary?.rewarded_count,
            bg: 'bg-violet-50',
          },
          {
            icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
            label: 'Total Earned',
            value: summary ? `$${summary.total_earned.toFixed(2)}` : undefined,
            bg: 'bg-emerald-50',
          },
        ].map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                {referralsLoading
                  ? <Skeleton className="h-6 w-14 mb-1 rounded" />
                  : <p className="text-xl font-bold text-slate-900">{stat.value ?? '—'}</p>
                }
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ══ TABLE ══════════════════════════════════════════════════════════════ */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
              <Link2 className="w-4 h-4 text-indigo-500" />
              Referral History
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 h-9 text-sm"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="h-9 bg-slate-100 border-0">
                  <TabsTrigger value="all"       className="text-xs data-[state=active]:bg-white">All</TabsTrigger>
                  <TabsTrigger value="pending"   className="text-xs data-[state=active]:bg-white">Pending</TabsTrigger>
                  <TabsTrigger value="completed" className="text-xs data-[state=active]:bg-white">Completed</TabsTrigger>
                  <TabsTrigger value="rewarded"  className="text-xs data-[state=active]:bg-white">Rewarded</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {referralsError ? (
            <div className="text-center py-10 flex flex-col items-center gap-2 text-red-500">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">Failed to load referrals.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    {['User', 'Code Used', 'Status', 'Date', 'Reward', 'Rewarded At'].map(h => (
                      <TableHead key={h} className="text-xs font-semibold text-slate-500">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralsLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-full rounded" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    : filtered.map(r => {
                        const cfg = statusConfig[r.status] ?? statusConfig.pending;
                        return (
                          <TableRow key={r.referral_id} className="hover:bg-slate-50/80 transition-colors group">
                            {/* User */}
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={r.referred_profile_image_url}
                                  name={r.referred_display_name}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                                    {r.referred_display_name ?? 'Unknown'}
                                  </p>
                                  <p className="text-xs text-slate-400 truncate">{r.referred_email}</p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Code */}
                            <TableCell>
                              <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg tracking-wider">
                                {r.referral_code_used}
                              </span>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Badge variant="secondary" className={`${cfg.color} border text-xs font-semibold gap-1 py-0.5`}>
                                {r.status === 'pending'
                                  ? <Clock className="w-3 h-3" />
                                  : <CheckCircle className="w-3 h-3" />
                                }
                                {cfg.label}
                              </Badge>
                            </TableCell>

                            {/* Date */}
                            <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                              {new Date(r.created_at).toLocaleDateString('en-AU', {
                                day: '2-digit', month: 'short', year: 'numeric',
                              })}
                            </TableCell>

                            {/* Reward */}
                            <TableCell>
                              {Number(r.reward_amount) > 0
                                ? <span className="text-sm font-bold text-emerald-600">${Number(r.reward_amount).toFixed(2)}</span>
                                : <span className="text-sm text-slate-300">—</span>
                              }
                            </TableCell>

                            {/* Rewarded at */}
                            <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                              {r.rewarded_at
                                ? new Date(r.rewarded_at).toLocaleDateString('en-AU', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                  })
                                : <span className="text-slate-300">—</span>
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })
                  }
                </TableBody>
              </Table>

              {!referralsLoading && filtered.length === 0 && (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">No referrals yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Share your code{' '}
                      <span className="font-mono font-bold text-indigo-500 tracking-wider">{code}</span>
                      {' '}to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!referralsLoading && !referralsError && filtered.length > 0 && (
            <p className="text-xs text-slate-400 mt-3 text-right">
              Showing {filtered.length} of {referrals.length} referrals
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}