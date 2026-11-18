import React from 'react';
import {
  TrendingUp,
  Home,
  DollarSign,
  ShoppingCart,
  Utensils,
  Wallet,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { PRESET_COMPARISONS, METRIC_CONFIGS } from '../constants/metrics';

const ICON_MAP = {
  TrendingUp,
  Home,
  DollarSign,
  ShoppingCart,
  Utensils,
  Wallet,
};

const EmptyState = ({ onSelectPreset }) => {
  return (
    <div className="space-y-12 py-8">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3.5">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
          Compare Living Costs Across Global Cities
        </h2>

        <p className="text-[#86868B] text-base leading-relaxed">
          Search and compare rent, groceries, dining, and local salary purchasing power across 360+ cities and 110+ countries using historical data indexed against New York City (100.0).
        </p>
      </div>

      {/* Preset Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#0071E3]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
              Popular Comparisons
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click to compare</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_COMPARISONS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group text-left p-5 rounded-3xl bg-white hover:bg-white border border-black/[0.06] hover:border-[#0071E3]/40 transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#0071E3]">
                    Compare
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0071E3] transform group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-semibold text-[#1D1D1F] text-base leading-snug">
                  {preset.name}
                </h4>
                <p className="text-xs text-[#86868B] mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-black/[0.04] flex flex-wrap gap-1.5">
                {preset.locations.map((loc) => (
                  <span
                    key={loc.name}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100/80 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                  >
                    {loc.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Index Guide */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
            Index Guide
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            All values are measured relative to New York City at 100.0.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METRIC_CONFIGS.map((config) => {
            const Icon = ICON_MAP[config.icon] || TrendingUp;

            return (
              <div key={config.key} className="flex items-start space-x-3.5">
                <div className={`w-9 h-9 rounded-2xl ${config.pastelBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1D1D1F]">
                    {config.title}
                  </h4>
                  <p className="text-xs text-[#86868B] mt-1 leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
