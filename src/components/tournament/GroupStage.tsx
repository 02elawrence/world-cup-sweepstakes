import type { GroupStanding } from '../../types';

interface Props {
  standings: GroupStanding[];
}

function GroupTable({ gs }: { gs: GroupStanding }) {
  const label = gs.group.replace('GROUP_', 'Group ');
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-slate-700">
        <h3 className="font-bold text-white text-sm">{label}</h3>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 border-b border-slate-700">
            <th className="text-left px-4 py-2 font-medium">Team</th>
            <th className="px-2 py-2 font-medium">P</th>
            <th className="px-2 py-2 font-medium">W</th>
            <th className="px-2 py-2 font-medium">D</th>
            <th className="px-2 py-2 font-medium">L</th>
            <th className="px-2 py-2 font-medium">GD</th>
            <th className="px-2 py-2 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {gs.table.map((row, i) => (
            <tr
              key={row.team.id}
              className={`border-b border-slate-700/50 ${i < 2 ? 'text-white' : 'text-slate-400'}`}
            >
              <td className="px-4 py-2 flex items-center gap-2">
                <span className="text-slate-500 w-4">{row.position}</span>
                <span>{row.team.name}</span>
                {i < 2 && <span className="ml-auto text-green-500 text-xs">↑</span>}
              </td>
              <td className="px-2 py-2 text-center">{row.playedGames}</td>
              <td className="px-2 py-2 text-center">{row.won}</td>
              <td className="px-2 py-2 text-center">{row.draw}</td>
              <td className="px-2 py-2 text-center">{row.lost}</td>
              <td className="px-2 py-2 text-center">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="px-2 py-2 text-center font-bold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GroupStage({ standings }: Props) {
  if (!standings.length) {
    return <p className="text-slate-500 text-sm text-center py-12">Group standings will appear here once the tournament begins.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {standings.map((gs) => (
        <GroupTable key={gs.group} gs={gs} />
      ))}
    </div>
  );
}
