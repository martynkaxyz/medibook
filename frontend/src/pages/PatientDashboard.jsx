import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const upcoming = appointments.filter(a =>
    ['pending', 'confirmed'].includes(a.status)
  );
  const history = appointments.filter(a =>
    ['cancelled', 'completed'].includes(a.status)
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const statusLabel = {
    pending: { text: 'Oczekująca', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-100 text-green-700' },
    cancelled: { text: 'Odwołana', color: 'bg-red-100 text-red-600' },
    completed: { text: 'Odbyta', color: 'bg-gray-100 text-gray-600' },
  };

  const monthName = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase();
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
            <p className="text-xs text-gray-400">Pacjent</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2 px-2">Menu</p>
        <nav className="flex flex-col gap-1">
          {[
            { label: 'Pulpit', icon: '▣', active: true },
            { label: 'Moje wizyty', icon: '📅' },
            { label: 'Historia', icon: '🕐' },
            { label: 'Mój profil', icon: '👤' },
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

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Dzień dobry, {user.first_name}!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* STATYSTYKI */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nadchodzące</p>
            <p className="text-3xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-xs text-gray-400 mt-1">wizyty w tym miesiącu</p>
            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">aktywne</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Wszystkich wizyt</p>
            <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
            <p className="text-xs text-gray-400 mt-1">od rejestracji</p>
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">historyczne</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Następna wizyta</p>
            <p className="text-3xl font-bold text-gray-900">
              {upcoming.length > 0 ? formatDate(upcoming[0].slot_date) : '-'}
            </p>
            <p className="text-xs text-gray-400 mt-1">dni do wizyty</p>
            <span className="inline-block mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">wkrótce</span>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#2A9D8F] text-white rounded-2xl p-5 flex items-center justify-between mb-8">
          <div>
            <p className="font-semibold">Umów kolejną wizytę</p>
            <p className="text-sm text-white/70">Sprawdź dostępne terminy w kalendarzu</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-[#2A9D8F] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Zarezerwuj teraz
          </button>
        </div>

        {/* NADCHODZĄCE WIZYTY */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Nadchodzące wizyty</h2>
            <button className="text-sm text-[#2A9D8F] font-medium">Zobacz wszystkie</button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Ładowanie...</p>
          ) : upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400">
              Brak nadchodzących wizyt
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map(a => (
                <div key={a.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
                  <div className="w-12 text-center">
                    <p className="text-lg font-bold text-gray-900">{new Date(a.slot_date).getDate()}</p>
                    <p className="text-xs text-gray-400">{monthName(a.slot_date)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{a.service_name || 'Wizyta'}</p>
                    <p className="text-xs text-gray-400">dr {a.doctor_first_name} {a.doctor_last_name} · {a.start_time?.slice(0,5)} - {a.end_time?.slice(0,5)}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusLabel[a.status]?.color}`}>
                      {statusLabel[a.status]?.text}
                    </span>
                  </div>
                  <button
                    onClick={() => cancelAppointment(a.id)}
                    className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition"
                  >
                    Odwołaj
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HISTORIA */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Historia wizyt</h2>
            <button className="text-sm text-[#2A9D8F] font-medium">Zobacz wszystkie</button>
          </div>

          {history.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400">
              Brak historii wizyt
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map(a => (
                <div key={a.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
                  <div className="w-12 text-center">
                    <p className="text-lg font-bold text-gray-900">{new Date(a.slot_date).getDate()}</p>
                    <p className="text-xs text-gray-400">{monthName(a.slot_date)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{a.service_name || 'Wizyta'}</p>
                    <p className="text-xs text-gray-400">dr {a.doctor_first_name} {a.doctor_last_name} · {a.start_time?.slice(0,5)} - {a.end_time?.slice(0,5)}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusLabel[a.status]?.color}`}>
                      {statusLabel[a.status]?.text}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="text-xs bg-[#2A9D8F] text-white px-3 py-1.5 rounded-lg hover:bg-[#1A7A6E] transition"
                  >
                    Umów ponownie
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}