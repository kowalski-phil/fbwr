'use client';

import { useState } from 'react';

interface InteractiveExampleProps {
  type: 'compound-calc' | 'triangle-widget' | 'rating-sort' | 'risk-slider';
}

export default function InteractiveExample({ type }: InteractiveExampleProps) {
  switch (type) {
    case 'compound-calc':
      return <CompoundCalc />;
    case 'triangle-widget':
      return <TriangleWidget />;
    default:
      return null;
  }
}

function CompoundCalc() {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(4);
  const [years, setYears] = useState(10);

  const withoutCompound = principal + (principal * rate / 100 * years);
  const withCompound = principal * Math.pow(1 + rate / 100, years);
  const difference = withCompound - withoutCompound;

  const maxVal = Math.max(withoutCompound, withCompound);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
      <h4 className="font-bold text-navy flex items-center gap-2">
        <span>🧮</span> Zinseszins-Rechner
      </h4>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Startbetrag: <span className="font-bold text-navy">{principal.toLocaleString('de-DE')} €</span>
          </label>
          <input
            type="range" min={1000} max={100000} step={1000} value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            className="w-full accent-fire-red"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Zinssatz: <span className="font-bold text-navy">{rate}%</span>
          </label>
          <input
            type="range" min={1} max={10} step={0.5} value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full accent-fire-red"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Laufzeit: <span className="font-bold text-navy">{years} Jahre</span>
          </label>
          <input
            type="range" min={1} max={30} step={1} value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full accent-fire-red"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-28">Ohne Zinseszins:</span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              className="bg-silver h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(withoutCompound / maxVal) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{Math.round(withoutCompound).toLocaleString('de-DE')} €</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-28">Mit Zinseszins:</span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-flame-orange to-flame-yellow h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(withCompound / maxVal) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">{Math.round(withCompound).toLocaleString('de-DE')} €</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-success/10 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-600">Vorteil durch Zinseszins:</p>
        <p className="text-xl font-bold text-success">+{Math.round(difference).toLocaleString('de-DE')} €</p>
      </div>
    </div>
  );
}

function TriangleWidget() {
  const [selected, setSelected] = useState<string | null>(null);

  const investments = [
    { id: 'girokonto', name: 'Girokonto', rendite: 5, sicherheit: 95, liquiditaet: 100 },
    { id: 'tagesgeld', name: 'Tagesgeld', rendite: 20, sicherheit: 95, liquiditaet: 90 },
    { id: 'festgeld', name: 'Festgeld', rendite: 40, sicherheit: 90, liquiditaet: 20 },
    { id: 'aktien', name: 'Aktien', rendite: 80, sicherheit: 30, liquiditaet: 70 },
    { id: 'anleihen', name: 'Anleihen', rendite: 35, sicherheit: 70, liquiditaet: 50 },
    { id: 'etfs', name: 'ETFs', rendite: 70, sicherheit: 50, liquiditaet: 75 },
    { id: 'gold', name: 'Gold', rendite: 30, sicherheit: 75, liquiditaet: 40 },
    { id: 'immobilien', name: 'Immobilien', rendite: 50, sicherheit: 70, liquiditaet: 10 },
  ];

  const active = investments.find(i => i.id === selected);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
      <h4 className="font-bold text-navy flex items-center gap-2">
        <span>🔺</span> Magisches Dreieck — Interaktiv
      </h4>
      <p className="text-xs text-gray-500">Klicke auf eine Anlageform und sieh, wo sie im Dreieck steht:</p>

      <div className="flex flex-wrap gap-2">
        {investments.map(inv => (
          <button
            key={inv.id}
            onClick={() => setSelected(inv.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
              selected === inv.id
                ? 'bg-fire-red text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {inv.name}
          </button>
        ))}
      </div>

      {active && (
        <div className="space-y-2 animate-fadeIn">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Rendite</span>
              <span className="font-bold text-navy">{active.rendite}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-flame-orange h-full rounded-full transition-all duration-500" style={{ width: `${active.rendite}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Sicherheit</span>
              <span className="font-bold text-navy">{active.sicherheit}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-success h-full rounded-full transition-all duration-500" style={{ width: `${active.sicherheit}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Liquidität</span>
              <span className="font-bold text-navy">{active.liquiditaet}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${active.liquiditaet}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
