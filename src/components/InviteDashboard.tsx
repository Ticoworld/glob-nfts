import React, { useEffect, useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { useAccount } from 'wagmi';

interface Invite {
  code: string;
  expiresAt?: string;
  status?: string;
  pointsEarned?: number;
}

const InviteDashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [invitePoints, setInvitePoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isConnected || !address) return;
    setLoading(true);
    fetch('/api/my-invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: address }),
    })
      .then(res => res.json())
      .then(data => {
  if (data.invites) setInvites(data.invites);
  if (typeof data.points === 'number') setPoints(data.points);
  if (typeof data.invitePoints === 'number') setInvitePoints(data.invitePoints);
        else setError(data.error || 'Could not fetch invites');
      })
      .catch(() => setError('Server error'))
      .finally(() => setLoading(false));
  }, [isConnected, address]);

  if (!isConnected) return null;

  // Split invites into active and history
  const activeInvites = invites.filter(i => i.status === 'Active');
  const historyInvites = invites.filter(i => i.status !== 'Active');

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mt-8 max-w-lg mx-auto">
  <h2 className="text-lg font-bold mb-4 text-primary">Your Invite Codes</h2>
  <div className="mb-2 text-green-400 font-semibold">Total Points: {points + invitePoints}</div>
  <div className="mb-2 text-blue-400 font-semibold">Base & Bonus Points: {points}</div>
  <div className="mb-4 text-yellow-400 font-semibold">Points from Invites: {invitePoints}</div>
  <div className="mb-4 text-xs text-gray-400">Base & bonus points are earned from tweets. Invite points are earned when your invitees complete tasks.</div>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <>
          {/* Active Invites */}
          {activeInvites.length === 0 ? (
            <div className="text-gray-400">No active invites available yet.</div>
          ) : (
            <ul className="space-y-3 mb-4">
              {activeInvites.map((invite, i) => {
                let statusColor = 'text-green-400';
                return (
                  <li key={invite.code} className="flex items-center justify-between bg-dark-900 rounded-lg px-4 py-3">
                    <span className="font-mono text-white flex items-center gap-2">
                      {invite.code}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(invite.code);
                        }}
                        className="ml-2 text-gray-400 hover:text-primary focus:outline-none"
                        title="Copy invite code"
                      >
                        <FiCopy size={16} />
                      </button>
                    </span>
                    <span className={`text-xs ml-2 ${statusColor}`}>
                      {invite.expiresAt && `Expires: ${new Date(invite.expiresAt).toLocaleDateString()} | `}
                      Status: {invite.status || 'Active'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Toggle for history */}
          <button
            className="text-xs text-blue-400 underline mb-2 focus:outline-none"
            onClick={() => setShowHistory(h => !h)}
          >
            {showHistory ? 'Hide Invite History' : `Show Invite History (${historyInvites.length})`}
          </button>
          {/* History Invites */}
          {showHistory && historyInvites.length > 0 && (
            <ul className="space-y-3">
              {historyInvites.map((invite, i) => {
                let statusColor = 'text-gray-400';
                if (invite.status === 'Expired') statusColor = 'text-red-400';
                return (
                  <li key={invite.code} className="flex items-center justify-between bg-dark-900 rounded-lg px-4 py-3">
                    <span className="font-mono text-white flex items-center gap-2">
                      {invite.code}
                    </span>
                    <span className={`text-xs ml-2 ${statusColor}`}>
                      {invite.expiresAt && `Expires: ${new Date(invite.expiresAt).toLocaleDateString()} | `}
                      Status: {invite.status}
                      {typeof invite.pointsEarned === 'number' && invite.pointsEarned > 0 && (
                        <span className="ml-2 text-blue-400">(+{invite.pointsEarned} pts)</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default InviteDashboard;
