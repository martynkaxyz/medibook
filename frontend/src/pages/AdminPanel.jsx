import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, role, isBlocked) => {
    try {
      await api.patch(`/admin/users/${id}`, { role, is_blocked: isBlocked });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const roleColors = {
    patient: 'bg-blue-100 text-blue-700',
    doctor: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">

      {/* SIDEBAR */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-8 px-4 fixed h-full">
        <span className="text-xl font-bold mb-8 px-2">
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>

        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-sm">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { label: 'Pulpit', icon: '▣', active: true },
            { label: 'Użytkownicy', icon: '👥' },
            { label: 'Rezerwacje', icon: '📅' },
            { label: 'Statystyki', icon: '📊' },
          ].map(({ label, icon, active }) => (
            <button key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left
                ${active ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'text-gray-500 hover:bg-gray-50'}`}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition w-full text-left"
          >
            <span>↩</span> Wyloguj się
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-56 flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel administracyjny</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* STATYSTYKI */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Użytkownicy', value: stats.total_users, color: 'text-gray-900' },
              { label: 'Wszystkie wizyty', value: stats.total_appointments, color: 'text-gray-900' },
              { label: 'Oczekujące', value: stats.pending_appointments, color: 'text-yellow-600' },
              { label: 'Potwierdzone', value: stats.confirmed_appointments, color: 'text-green-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* UŻYTKOWNICY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Zarządzanie użytkownikami</h2>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 p-5">Ładowanie...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left p-4">Użytkownik</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Rola</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{u.first_name} {u.last_name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {u.is_blocked ? 'Zablokowany' : 'Aktywny'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => updateUser(u.id, e.target.value, u.is_blocked)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#2A9D8F]"
                        >
                          <option value="patient">patient</option>
                          <option value="doctor">doctor</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          onClick={() => updateUser(u.id, u.role, !u.is_blocked)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition
                            ${u.is_blocked
                              ? 'border-green-200 text-green-600 hover:bg-green-50'
                              : 'border-red-200 text-red-500 hover:bg-red-50'}`}
                        >
                          {u.is_blocked ? 'Odblokuj' : 'Zablokuj'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}