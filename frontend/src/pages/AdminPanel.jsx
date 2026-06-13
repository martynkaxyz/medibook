import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pulpit');
  const [roleFilter, setRoleFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cardsRef = useRef([]);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, [users, activeTab]);

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

  const deleteUser = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
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

  const tabs = [
    { id: 'pulpit', label: 'Pulpit', icon: '▣' },
    { id: 'uzytkownicy', label: 'Użytkownicy', icon: '👥' },
    { id: 'statystyki', label: 'Statystyki', icon: '📊' },
  ];

  const UsersTable = ({ filteredUsers }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
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
            {filteredUsers.map((u, i) => (
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
                  <div className="flex gap-2 items-center">
                    <select value={u.role}
                      onChange={(e) => updateUser(u.id, e.target.value, u.is_blocked)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#2A9D8F]">
                      <option value="patient">patient</option>
                      <option value="doctor">doctor</option>
                      <option value="admin">admin</option>
                    </select>
                    <button onClick={() => updateUser(u.id, u.role, !u.is_blocked)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition
                        ${u.is_blocked ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                      {u.is_blocked ? 'Odblokuj' : 'Zablokuj'}
                    </button>
                    <button onClick={() => deleteUser(u.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition">
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <style>{`
        .card-animate { opacity: 0; transform: translateY(24px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .card-animate.visible { opacity: 1; transform: translateY(0); }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(42,157,143,0.12); }
      `}</style>

      {/* Overlay mobilny */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-100 flex flex-col py-8 px-4
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <span className="text-xl font-bold mb-4 px-2">
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>
        <button onClick={() => navigate('/')}
          className="text-xs text-gray-400 hover:text-[#2A9D8F] transition px-2 mb-4 text-left">
          ← Strona główna
        </button>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map(({ id, label, icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left
                ${activeTab === id ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'text-gray-500 hover:bg-gray-50'}`}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition w-full text-left">
            <span>↩</span> Wyloguj się
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-56 flex flex-col">

        {/* TOPBAR mobilny */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-600 leading-none">☰</button>
          <span className="font-bold text-gray-900">Medi<span className="text-[#2A9D8F]">Book</span></span>
          <div className="w-8 h-8 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center text-xs font-bold">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
        </div>

        <div className="p-4 md:p-8">

        {/* PULPIT */}
        {activeTab === 'pulpit' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Panel administracyjny</h1>
              <p className="text-sm text-gray-400 mt-1">
                {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Użytkownicy', value: stats.total_users, color: 'text-gray-900' },
                  { label: 'Wszystkie wizyty', value: stats.total_appointments, color: 'text-gray-900' },
                  { label: 'Oczekujące', value: stats.pending_appointments, color: 'text-yellow-600' },
                  { label: 'Potwierdzone', value: stats.confirmed_appointments, color: 'text-green-600' },
                ].map(({ label, value, color }, i) => (
                  <div key={label} ref={el => cardsRef.current[i] = el}
                    className="card-animate hover-lift bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Ostatni użytkownicy</h2>
              <button onClick={() => setActiveTab('uzytkownicy')}
                className="text-sm text-[#2A9D8F] font-medium">Zobacz wszystkich</button>
            </div>
            <UsersTable filteredUsers={users.slice(0, 5)} />
          </>
        )}

        {/* UŻYTKOWNICY */}
        {activeTab === 'uzytkownicy' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Użytkownicy</h1>
                <p className="text-sm text-gray-400 mt-1">Zarządzaj kontami użytkowników</p>
              </div>
              <div className="flex gap-3">
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#2A9D8F]">
                  <option value="">Wszystkie role</option>
                  <option value="patient">Pacjenci</option>
                  <option value="doctor">Lekarze</option>
                  <option value="admin">Admini</option>
                </select>
              </div>
            </div>
            <UsersTable filteredUsers={roleFilter ? users.filter(u => u.role === roleFilter) : users} />
          </>
        )}

        {/* STATYSTYKI */}
        {activeTab === 'statystyki' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Statystyki</h1>
              <p className="text-sm text-gray-400 mt-1">Przegląd danych platformy</p>
            </div>
            {stats && (
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Łączna liczba użytkowników', value: stats.total_users, icon: '👥', desc: 'zarejestrowanych kont' },
                  { label: 'Wszystkie wizyty', value: stats.total_appointments, icon: '📅', desc: 'rezerwacji w systemie' },
                  { label: 'Oczekujące wizyty', value: stats.pending_appointments, icon: '⏳', desc: 'wymaga potwierdzenia' },
                  { label: 'Potwierdzone wizyty', value: stats.confirmed_appointments, icon: '✓', desc: 'zatwierdzonych wizyt' },
                ].map(({ label, value, icon, desc }, i) => (
                  <div key={label} ref={el => cardsRef.current[i] = el}
                    className="card-animate hover-lift bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#2A9D8F]/10 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-4xl font-bold text-gray-900">{value}</p>
                      <p className="text-sm text-gray-400 mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        </div>
      </main>
    </div>
  );
}