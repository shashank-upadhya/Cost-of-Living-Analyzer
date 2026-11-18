import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { METRIC_CONFIGS, LOCATION_COLORS } from '../constants/metrics';

const HistoricalTrendChart = ({ locations }) => {
  const [selectedMetric, setSelectedMetric] = useState('coi');

  const cityLocations = locations.filter(l => l.isCity);
  const years = ['2020', '2021', '2022', '2023', '2024'];

  const currentMetricConfig = METRIC_CONFIGS.find(m => m.key === selectedMetric) || METRIC_CONFIGS[0];

  const datasets = cityLocations.map((loc, idx) => {
    const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];
    const rawArr = loc.rawData?.Index?.[selectedMetric] || [];
    
    // Reverse for chronological 2020->2024
    const chronologicalData = [...rawArr].reverse();

    return {
      label: loc.name,
      data: chronologicalData,
      borderColor: color.hex,
      backgroundColor: color.chartFill,
      borderWidth: 2.5,
      tension: 0.35,
      pointRadius: 4.5,
      pointHoverRadius: 7,
      pointBackgroundColor: color.hex,
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      fill: true,
    };
  });

  // NYC benchmark reference
  datasets.push({
    label: 'NYC Benchmark (100.0)',
    data: [100, 100, 100, 100, 100],
    borderColor: '#86868B',
    borderWidth: 1.5,
    borderDash: [5, 5],
    pointRadius: 0,
    fill: false,
  });

  const chartData = {
    labels: years,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#1D1D1F',
          font: {
            family: '"Plus Jakarta Sans", -apple-system, sans-serif',
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          boxWidth: 7,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#E5E5EA',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 12,
        titleFont: {
          family: '"Plus Jakarta Sans", -apple-system, sans-serif',
          size: 13,
          weight: 600,
        },
        bodyFont: {
          family: '"JetBrains Mono", monospace',
          size: 12,
        },
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.parsed.y.toFixed(1)} pts`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#F2F2F7',
          drawBorder: false,
        },
        ticks: {
          color: '#86868B',
          font: {
            family: '"Plus Jakarta Sans", -apple-system, sans-serif',
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#F2F2F7',
          drawBorder: false,
        },
        ticks: {
          color: '#86868B',
          font: {
            family: '"JetBrains Mono", monospace',
            size: 11,
          },
        },
      },
    },
  };

  if (cityLocations.length === 0) {
    return (
      <div className="bg-white border border-black/[0.06] rounded-3xl p-8 text-center shadow-sm">
        <p className="text-[#86868B] text-sm">
          5-Year historical trends are available for cities. Add at least one city to view the timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Header & Apple Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
            5-Year Historical Trends (2020 – 2024)
          </h3>
          <p className="text-xs text-[#86868B] mt-0.5">
            Track how living cost indices evolved over the past 5 years relative to NYC (100.0)
          </p>
        </div>

        {/* Apple-style Segmented Metric Tabs */}
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

      {/* Chart Canvas */}
      <div className="h-[360px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="mt-4 pt-3.5 border-t border-black/[0.04] flex items-center justify-between text-xs text-[#86868B]">
        <span>Showing: {currentMetricConfig.title} ({currentMetricConfig.subtitle})</span>
        <span className="font-mono text-slate-400">2020–2024 Chronological</span>
      </div>
    </div>
  );
};

export default HistoricalTrendChart;
