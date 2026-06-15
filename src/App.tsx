import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import DraftPage from './components/draft/DraftPage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import TournamentPage from './components/tournament/TournamentPage';
import GroupDraftPage from './components/group-draft/GroupDraftPage';
import GroupLeaderboardPage from './components/group-leaderboard/GroupLeaderboardPage';
import S2DrawPage from './components/s2-draw/S2DrawPage';
import S2LeaderboardPage from './components/s2-leaderboard/S2LeaderboardPage';

const GROUP_ONLY = import.meta.env.VITE_GROUP_ONLY === 'true';

const NAV = [
  { to: '/tournament', label: '⚽ Tournament' },
  ...(!GROUP_ONLY ? [
    { section: 'Ed & AJ' },
    { to: '/draft', label: '🪙 Draft' },
    { to: '/leaderboard', label: '🏆 Board' },
  ] : []),
  { section: 'Group 1' },
  { to: '/group-draft', label: '👥 Draw' },
  { to: '/group-leaderboard', label: '🏆 Board' },
  { section: 'Group 2' },
  { to: '/s2-draw', label: '🎉 Draw' },
  { to: '/s2-leaderboard', label: '💰 Board' },
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-white font-black text-lg">WC 2026 🏆</span>
        <nav className="flex items-center gap-1">
          {NAV.map((item, i) => {
            if ('section' in item) {
              return (
                <span key={i} className="text-slate-600 text-xs px-2 hidden sm:block select-none">
                  {item.section}
                </span>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/draft" element={<DraftPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/group-draft" element={<GroupDraftPage />} />
          <Route path="/group-leaderboard" element={<GroupLeaderboardPage />} />
          <Route path="/s2-draw" element={<S2DrawPage />} />
          <Route path="/s2-leaderboard" element={<S2LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/tournament" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
