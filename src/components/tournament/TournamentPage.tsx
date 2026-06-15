import { useState } from 'react';
import { useTournament } from '../../hooks/useTournament';
import GroupStage from './GroupStage';
import FixtureList from './FixtureList';
import KnockoutBracket from './KnockoutBracket';
import TopScorers from './TopScorers';

type Tab = 'groups' | 'fixtures' | 'bracket' | 'stats';

const TABS: { id: Tab; label: string }[] = [
  { id: 'groups',   label: 'Groups'   },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'bracket',  label: 'Bracket'  },
  { id: 'stats',    label: 'Stats'    },
];

export default function TournamentPage() {
  const { data, loading, error, refresh, clearCache } = useTournament();
  const [activeTab, setActiveTab] = useState<Tab>('groups');

  const lastUpdated = data.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Error banner */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-red-400 text-sm">⚠ {error}</p>
          <button onClick={clearCache} className="text-red-400 hover:text-red-300 text-xs underline ml-4">
            Clear cache & retry
          </button>
        </div>
      )}

      {/* Tab bar + refresh */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && !loading && (
            <span className="text-slate-600 text-xs">Updated {lastUpdated}</span>
          )}
          {loading && <span className="text-slate-500 text-xs animate-pulse">Fetching…</span>}
          <button
            onClick={refresh}
            disabled={loading}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors disabled:opacity-40"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* No data state */}
      {!loading && data.fixtures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm mb-3">No tournament data loaded yet.</p>
          <button
            onClick={clearCache}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
          >
            Load data
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'groups'   && <GroupStage standings={data.standings} />}
      {activeTab === 'fixtures' && <FixtureList fixtures={data.fixtures} />}
      {activeTab === 'bracket'  && <KnockoutBracket fixtures={data.fixtures} />}
      {activeTab === 'stats'    && <TopScorers scorers={data.scorers} fixtures={data.fixtures} />}
    </div>
  );
}
