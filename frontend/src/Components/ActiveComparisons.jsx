import React from 'react';
import { X, Star, RefreshCw } from 'lucide-react';
import { LOCATION_COLORS } from '../constants/metrics';

const ActiveComparisons = ({
  locations,
  onRemoveLocation,
  onClearAll,
  baselineIndex,
  onSetBaseline,
}) => {
  if (locations.length === 0) return null;

  return (
    <div className="bg-white/60 backdrop-blur-md border border-black/[0.06] rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
            Compared Locations ({locations.length}/4)
          </span>
          <span className="text-xs text-slate-400">
            • Baseline: <span className="text-[#1D1D1F] font-medium">{baselineIndex === -1 ? 'New York City (100.0)' : locations[baselineIndex]?.name}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {baselineIndex !== -1 && (
            <button
              onClick={() => onSetBaseline(-1)}
              className="text-xs text-[#0071E3] hover:underline font-medium"
            >
              Reset baseline to NYC
            </button>
          )}
          {locations.length > 1 && (
            <button
              onClick={onClearAll}
              className="text-xs text-[#86868B] hover:text-red-600 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Location Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {locations.map((loc, idx) => {
          const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];
          const isBaseline = baselineIndex === idx;

          return (
            <div
              key={loc.name}
              className={`relative rounded-2xl p-4 transition-all border ${
                isBaseline
                  ? 'bg-white ring-2 ring-[#0071E3] border-transparent shadow-[0_4px_16px_rgba(0,113,227,0.12)]'
                  : 'bg-white border-black/[0.06] hover:border-black/[0.12] shadow-sm'
              }`}
            >
              {/* Header: Dot + Type + Remove */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      loc.isCity
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {loc.isCity ? 'City' : 'Country'}
                  </span>
                </div>

                <button
                  onClick={() => onRemoveLocation(loc.name)}
                  className="w-6 h-6 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                  title="Remove location"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>

              {/* Location Title */}
              <div className="mb-3.5">
                <h3 className="font-semibold text-[#1D1D1F] text-base leading-tight truncate">
                  {loc.name}
                </h3>
                {loc.fullName && loc.fullName !== loc.name && (
                  <p className="text-xs text-[#86868B] truncate mt-0.5">
                    {loc.fullName}
                  </p>
                )}
              </div>

              {/* Baseline button */}
              <button
                onClick={() => onSetBaseline(isBaseline ? -1 : idx)}
                className={`w-full text-xs font-medium py-1.5 px-2.5 rounded-xl border transition-all flex items-center justify-center space-x-1.5 ${
                  isBaseline
                    ? 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/30 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100/80 text-slate-600 border-slate-200/80'
                }`}
              >
                <Star className={`w-3 h-3 ${isBaseline ? 'fill-[#0071E3] text-[#0071E3]' : 'text-slate-400'}`} />
                <span>{isBaseline ? 'Anchor Baseline' : 'Set as baseline'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveComparisons;
