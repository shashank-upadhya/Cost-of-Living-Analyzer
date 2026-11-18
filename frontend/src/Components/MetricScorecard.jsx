import React from 'react';
import {
  TrendingUp,
  Home,
  DollarSign,
  ShoppingCart,
  Utensils,
  Wallet,
  Info,
} from 'lucide-react';
import { METRIC_CONFIGS, LOCATION_COLORS } from '../constants/metrics';

const ICON_MAP = {
  TrendingUp,
  Home,
  DollarSign,
  ShoppingCart,
  Utensils,
  Wallet,
};

const MetricScorecard = ({ locations, baselineIndex }) => {
  const getValue = (loc, key) => {
    if (!loc) return null;
    if (loc.isCity) {
      return loc.rawData?.Index?.[key]?.[0] ?? null;
    } else {
      return loc.rawData?.[key]?.[0] ?? null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {METRIC_CONFIGS.map((config) => {
        const IconComponent = ICON_MAP[config.icon] || TrendingUp;

        const values = locations.map((loc) => ({
          loc,
          val: getValue(loc, config.key),
        }));

        const maxVal = Math.max(...values.map((v) => v.val || 100), 100);

        const baselineVal =
          baselineIndex >= 0 && baselineIndex < locations.length
            ? getValue(locations[baselineIndex], config.key)
            : 100;

        return (
          <div
            key={config.key}
            className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-black/[0.1] transition-all flex flex-col justify-between"
          >
            {/* Card Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-2xl ${config.pastelBg} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1D1D1F] text-sm leading-tight">
                      {config.title}
                    </h3>
                    <p className="text-[11px] text-[#86868B] mt-0.5">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-60 p-3 bg-[#1D1D1F] text-slate-200 text-xs rounded-2xl shadow-xl z-50 pointer-events-none leading-relaxed">
                    {config.description}
                  </div>
                </div>
              </div>

              {/* Location Rows */}
              <div className="space-y-3 mt-4">
                {values.map(({ loc, val }, idx) => {
                  const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];
                  const percentWidth = val ? Math.min(Math.round((val / maxVal) * 100), 100) : 0;

                  let diff = null;
                  if (val !== null && baselineVal !== null && baselineVal !== 0) {
                    diff = Math.round(((val - baselineVal) / baselineVal) * 100);
                  }

                  const isHigherBetter = config.higherIsBetter;
                  let diffBadgeStyle = 'bg-slate-100 text-slate-600';
                  if (diff !== null && diff !== 0) {
                    if (isHigherBetter) {
                      diffBadgeStyle = diff > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
                    } else {
                      diffBadgeStyle = diff > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700';
                    }
                  }

                  return (
                    <div key={loc.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="font-medium text-[#1D1D1F] truncate">
                            {loc.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 font-mono">
                          <span className="font-semibold text-[#1D1D1F] text-sm">
                            {val !== null ? val.toFixed(1) : 'N/A'}
                          </span>

                          {diff !== null && diff !== 0 && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${diffBadgeStyle}`}>
                              {diff > 0 ? '+' : ''}{diff}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Bar with Pastel Styling */}
                      <div className="w-full h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentWidth}%`,
                            backgroundColor: color.hex,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Baseline Reference Footer */}
            <div className="pt-3.5 mt-4 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#86868B] font-mono">
              <span>Baseline anchor</span>
              <span className="text-[#1D1D1F] font-medium">
                {baselineIndex === -1
                  ? 'NYC = 100.0'
                  : `${locations[baselineIndex]?.name} = ${baselineVal?.toFixed(1) ?? '100.0'}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricScorecard;
