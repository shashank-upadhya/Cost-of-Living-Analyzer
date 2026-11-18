import React, { useState } from 'react';
import { METRIC_CONFIGS } from '../constants/metrics';
import { Globe } from 'lucide-react';

const CountryCityBreakdown = ({ countryLocation }) => {
  const [selectedMetric, setSelectedMetric] = useState('coi');

  if (!countryLocation || countryLocation.isCity) return null;

  const raw = countryLocation.rawData;
  if (!raw) return null;

  const currentMetricConfig = METRIC_CONFIGS.find(m => m.key === selectedMetric) || METRIC_CONFIGS[0];

  const values = raw[selectedMetric] || [];
  const labels = raw[`${selectedMetric}_label`] || [];

  const items = labels.map((label, i) => ({
    label: label ?? 'Unknown',
    val: values[i] ?? 0,
    isAverage: i === 0,
  })).filter(item => item.label && item.val !== null);

  const averageVal = items[0]?.val ?? 100;
  const maxVal = Math.max(...items.map(i => i.val), 100);

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#34C759]" />
            <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
              {countryLocation.name}: Top Cities vs National Average
            </h3>
          </div>
          <p className="text-xs text-[#86868B] mt-0.5">
            Compare national baseline with the highest-cost cities in {countryLocation.name}
          </p>
        </div>

        {/* Apple Segmented Metric Tabs */}
        <div className="flex items-center flex-wrap gap-1 p-1 bg-[#E5E5EA]/60 rounded-2xl">
          {METRIC_CONFIGS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                selectedMetric === metric.key
                  ? 'bg-white text-[#1D1D1F] font-semibold shadow-sm'
                  : 'text-[#86868B] hover:text-[#1D1D1F] font-medium'
              }`}
            >
              {metric.shortTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const percentWidth = Math.min(Math.round((item.val / maxVal) * 100), 100);
          const diffVsAvg = Math.round(((item.val - averageVal) / averageVal) * 100);

          return (
            <div
              key={item.label}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.isAverage
                  ? 'bg-emerald-50/60 border-emerald-200/80 shadow-sm'
                  : 'bg-white border-black/[0.06] hover:border-black/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold font-mono ${
                    item.isAverage
                      ? 'bg-emerald-200 text-emerald-800'
                      : idx === 1
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.isAverage ? '★' : idx}
                  </span>
                  <span className="font-medium text-[#1D1D1F] text-sm">
                    {item.label} {item.isAverage ? '(Country Average)' : ''}
                  </span>
                </div>

                <div className="flex items-center space-x-3 font-mono">
                  <span className="font-semibold text-[#1D1D1F] text-base">
                    {item.val.toFixed(1)}
                  </span>
                  {!item.isAverage && diffVsAvg !== 0 && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      diffVsAvg > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {diffVsAvg > 0 ? `+${diffVsAvg}%` : `${diffVsAvg}%`} vs avg
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.isAverage ? 'bg-[#34C759]' : 'bg-[#0071E3]'
                  }`}
                  style={{ width: `${percentWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountryCityBreakdown;
