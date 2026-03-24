import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Activity, BrainCircuit, Users, Target, Clock, Loader2 } from 'lucide-react';

const API = 'http://localhost:5000/api/project';

type Health = {
  status: string;
  summary: string;
  targetMilestone: string;
  borderClass: string;
  badgeClass: string;
  bannerGradient: string;
};

type Metric = {
  key: string;
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
  bar: string;
};

type Anomaly = {
  severity: string;
  severityLabel: string;
  timeLabel: string;
  title: string;
  description: string;
};

type GuidanceItem = {
  title: string;
  recommendationText: string;
};

const iconMap = {
  Target,
  Users,
  Clock,
  Activity
} as const;

export default function GroupIntelligenceOverview() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [guidance, setGuidance] = useState<GuidanceItem[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/intelligence/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load intelligence overview');
        }
        if (cancelled) return;
        setHealth(data.health || null);
        setMetrics(Array.isArray(data.metrics) ? data.metrics : []);
        setAnomalies(Array.isArray(data.anomalies) ? data.anomalies : []);
        setGuidance(Array.isArray(data.guidance) ? data.guidance : []);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="card p-10 text-center animate-fade-up">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Running Project Intelligence Engine…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 border border-red-200 bg-red-50 text-red-700 text-sm font-semibold animate-fade-up">
        {error}
      </div>
    );
  }

  const bannerBorder = health?.borderClass || 'border-l-amber-500';
  const bannerFrom = health?.bannerGradient || 'from-amber-50';
  const statusClass = health?.badgeClass || 'text-amber-600';

  return (
    <div className="animate-fade-up space-y-8">
      <div
        className={`card p-6 border-l-4 ${bannerBorder} bg-gradient-to-r ${bannerFrom} to-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-32 h-32 text-amber-900" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-amber-100 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              AI Health Assessment: <span className={statusClass}>{health?.status || '—'}</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
              {health?.summary || 'No summary available.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((dim) => {
          const Icon = iconMap[dim.icon as keyof typeof iconMap] || Target;
          return (
            <div key={dim.key} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${dim.bg}`}>
                  <Icon className={`w-5 h-5 ${dim.color}`} />
                </div>
                <div className={`text-2xl font-black ${dim.color}`}>{dim.value}</div>
              </div>
              <div className="text-sm font-bold text-slate-700 mb-2">{dim.label}</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${dim.bar}`} style={{ width: `${dim.value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">Detected Anomalies</h3>
          </div>
          <div className="p-5 space-y-4">
            {anomalies.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium text-center py-6">
                No rule-based anomalies detected from tasks, status history, or synced Git commits.
              </p>
            ) : (
              anomalies.map((a, idx) => {
                const isHigh = a.severity === 'high';
                return (
                  <div
                    key={`${a.title}-${idx}`}
                    className={`p-4 border rounded-xl relative overflow-hidden ${
                      isHigh ? 'border-red-100 bg-red-50/50' : 'border-amber-100 bg-amber-50/50'
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${isHigh ? 'bg-red-500' : 'bg-amber-500'}`}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge py-0.5 ${isHigh ? 'badge-red' : 'badge-amber'}`}>
                        {a.severityLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{a.timeLabel}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{a.description}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">AI Guidance & Mitigation</h3>
          </div>
          <div className="p-5 space-y-4">
            {guidance.map((item, i) => (
              <div key={`${item.title}-${i}`} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold bg-white shrink-0 shadow-sm mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-sm text-slate-600 mt-0.5">{item.recommendationText}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Apply Automated Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
