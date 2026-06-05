import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, slotRes, serviceRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/slots/my'),
        api.get('/services'),
      ]);
      setAppointments(apptRes.data);
      setSlots(slotRes.data);
      setServices(serviceRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySlots = slots.filter(s => s.slot_date?.startsWith(today));
  const todayAppointments = appointments.filter(a => a.slot_date?.startsWith(today));
  const pending = appointments.filter(a => a.status === 'pending');

  const filteredAppointments = activeTab === 'all' ? appointments
    : activeTab === 'today' ? todayAppointments
    : pending;

  const statusLabel = {
    pending: { text: 'Oczekująca', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-100 text-green-700' },
    cancelled: { text: 'Odwołana', color: 'bg-red-100 text-red-600' },
    completed: { text: 'Odbyta', color: 'bg-gray-100 text-gray-600' },
  };

  const formatTime = (t) => t?.slice(0, 5) || '';
  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">

      {/* SIDEBAR */}
      <aside className="w-56 bg-[#1A2E25] text-white flex flex-col py-8 px-4 fixed h-full">
        <span className="text-xl font-bold mb-8 px-2">
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>

        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-sm">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-white/50">dr</p>
          </div>
        </div>

        <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 px-2">Menu główne</p>
        <nav className="flex flex-col gap-1">
          {[
            { label: 'Pulpit', icon: '▣', active: true },
            { label: 'Rezerwacje', icon: '📅' },
            { label: 'Pacjenci', icon: '👤' },
          ].map(({ label, icon, active }) => (
            <button key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left
                ${active ? 'bg-[#2A9D8F]/20 text-[#2A9D8F]' : 'text-white/60 hover:bg-white/5'}`}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 px-2 mt-6">Ustawienia</p>
        <nav className="flex flex-col gap-1">
          {[
            { label: 'Sloty czasowe', icon: '🕐' },
            { label: 'Usługi', icon: '🩺' },
          ].map(({ label, icon }) => (
            <button key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 transition text-left">
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full text-left"
          >
            <span>↩</span> Wyloguj się
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-56 flex-1 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dzień dobry, {user.first_name}!
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1A7A6E] transition">
            + Dodaj slot
          </button>
        </div>

        {/* STATYSTYKI */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Dziś', value: todayAppointments.length, sub: 'wizyt zaplanowanych', color: 'text-gray-900' },
            { label: 'Oczekujące', value: pending.length, sub: 'wymagają potwierdzenia', color: 'text-yellow-600' },
            { label: 'Ten miesiąc', value: appointments.length, sub: '+12% vs poprzedni', color: 'text-gray-900' },
            { label: 'Pacjenci', value: 94, sub: 'łącznie zarejestrowanych', color: 'text-gray-900' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* REZERWACJE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Rezerwacje</h2>
            <div className="flex gap-2">
              {['all', 'today', 'pending'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition
                    ${activeTab === tab ? 'bg-[#2A9D8F] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {tab === 'all' ? 'Wszystkie' : tab === 'today' ? 'Dziś' : 'Oczekujące'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 p-5">Ładowanie...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 p-5 text-center">Brak rezerwacji</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left p-4">Pacjent</th>
                  <th className="text-left p-4">Usługa</th>
                  <th className="text-left p-4">Data i godzina</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">
                          {a.patient_first_name?.[0]}{a.patient_last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{a.patient_first_name} {a.patient_last_name}</p>
                          <p className="text-xs text-gray-400">{a.patient_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{a.service_name || 'Wizyta'}</td>
                    <td className="p-4 text-sm text-gray-600">{formatDate(a.slot_date)} · {formatTime(a.start_time)}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabel[a.status]?.color}`}>
                        + {statusLabel[a.status]?.text}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition">
                          Szczegóły
                        </button>
                        <button className="text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                          Odwołaj
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SLOTY I USŁUGI */}
        <div className="grid grid-cols-2 gap-6">
          {/* SLOTY */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Sloty - dziś</h2>
            {todaySlots.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Brak slotów na dziś</p>
            ) : (
              <div className="flex flex-col gap-2">
                {todaySlots.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatTime(s.start_time)}-{formatTime(s.end_time)}</p>
                      <p className="text-xs text-gray-400">{s.is_available ? 'Wolny' : 'Zajęty'}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition ${s.is_available ? 'bg-[#2A9D8F]' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full m-0.5 shadow transition-transform ${s.is_available ? 'translate-x-5' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USŁUGI */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Usługi</h2>
            <div className="flex flex-col gap-2">
              {services.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.duration_minutes} min · {s.is_active ? 'aktywna' : 'nieaktywna'}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full ${s.is_active ? 'bg-[#2A9D8F]' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full m-0.5 shadow transition-transform ${s.is_active ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}