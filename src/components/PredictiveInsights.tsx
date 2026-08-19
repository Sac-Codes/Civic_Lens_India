import React from 'react';
import { TrendingUp } from 'lucide-react';

export const PredictiveInsights: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <section className="glass-panel rounded-2xl border border-dashed border-slate-700 p-12 text-center">
      <TrendingUp className="mx-auto h-8 w-8 text-slate-600" />
      <h1 className="mt-4 font-heading text-2xl font-bold text-white">Predictive insights</h1>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Forecasts will appear when enough historical incident data is available for a reliable analysis.</p>
    </section>
  </div>
);
