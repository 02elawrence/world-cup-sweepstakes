import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import TournamentPage from './components/tournament/TournamentPage';
import S2DrawPage from './components/s2-draw/S2DrawPage';
import S2LeaderboardPage from './components/s2-leaderboard/S2LeaderboardPage';

const NAV = [
  { to: '/tournament', label: '⚽ Tournament' },
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
        <span className="text-white font-black text-lg">WC 2026 🏆</span>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
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
          ))}
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
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/s2-draw" element={<S2DrawPage />} />
          <Route path="/s2-leaderboard" element={<S2LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/tournament" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
