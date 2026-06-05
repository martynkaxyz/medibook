import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pulpit');

  useEffect(() => { fetchAppointments(); }, []);

  useEffect(() => {
    if (appointments.length === 0) return;
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
  }, [appointments, activeTab]);

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

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const history = appointments.filter(a => ['cancelled', 'completed'].includes(a.status));

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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const AppointmentCard = ({ a, i, showCancel = false, showRebook = false, refIndex }) => (
    <div key={a.id}
      ref={el => cardsRef.current[refIndex] = el}
      className="card-animate hover-lift bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
      <div className="w-12 text-center flex-shrink-0">
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
      {showCancel && (
        <button onClick={() => cancelAppointment(a.id)}
          className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition">
          Odwołaj
        </button>
      )}
      {showRebook && (
        <button onClick={() => navigate('/booking')}
          className="text-xs bg-[#2A9D8F] text-white px-3 py-1.5 rounded-lg hover:bg-[#1A7A6E] transition">
          Umów ponownie
        </button>
      )}
    </div>
  );

  const tabs = [
    { id: 'pulpit', label: 'Pulpit', icon: '▣' },
    { id: 'wizyty', label: 'Moje wizyty', icon: '📅' },
    { id: 'historia', label: 'Historia', icon: '🕐' },
    { id: 'profil', label: 'Mój profil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <style>{`
        .card-animate { opacity: 0; transform: translateY(24px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .card-animate.visible { opacity: 1; transform: translateY(0); }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(42,157,143,0.12); }
      `}</style>

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
          {tabs.map(({ id, label, icon }) => (
            <button key={id}
              onClick={() => setActiveTab(id)}
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
      <main className="ml-56 flex-1 p-8">

        {/* PULPIT */}
        {activeTab === 'pulpit' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dzień dobry, {user.first_name}!</h1>
              <p className="text-sm text-gray-400 mt-1">
                {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Nadchodzące', value: upcoming.length, sub: 'wizyty w tym miesiącu', badge: 'aktywne', badgeColor: 'bg-green-100 text-green-700' },
                { label: 'Wszystkich wizyt', value: appointments.length, sub: 'od rejestracji', badge: 'historyczne', badgeColor: 'bg-blue-100 text-blue-700' },
                { label: 'Następna wizyta', value: upcoming.length > 0 ? formatDate(upcoming[0].slot_date) : '-', sub: 'dni do wizyty', badge: 'wkrótce', badgeColor: 'bg-orange-100 text-orange-700' },
              ].map(({ label, value, sub, badge, badgeColor }, i) => (
                <div key={label} ref={el => cardsRef.current[i] = el}
                  className="card-animate hover-lift bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
              ))}
            </div>
            <div ref={el => cardsRef.current[3] = el}
              className="card-animate bg-[#2A9D8F] text-white rounded-2xl p-5 flex items-center justify-between mb-8">
              <div>
                <p className="font-semibold">Umów kolejną wizytę</p>
                <p className="text-sm text-white/70">Sprawdź dostępne terminy w kalendarzu</p>
              </div>
              <button onClick={() => navigate('/booking')}
                className="bg-white text-[#2A9D8F] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition">
                Zarezerwuj teraz
              </button>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Nadchodzące wizyty</h2>
                <button onClick={() => setActiveTab('wizyty')} className="text-sm text-[#2A9D8F] font-medium">Zobacz wszystkie</button>
              </div>
              {loading ? <p className="text-sm text-gray-400">Ładowanie...</p> :
                upcoming.length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400">Brak nadchodzących wizyt</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {upcoming.slice(0, 2).map((a, i) => (
                      <AppointmentCard key={a.id} a={a} i={i} showCancel refIndex={4 + i} />
                    ))}
                  </div>
                )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Historia wizyt</h2>
                <button onClick={() => setActiveTab('historia')} className="text-sm text-[#2A9D8F] font-medium">Zobacz wszystkie</button>
              </div>
              {history.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400">Brak historii wizyt</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.slice(0, 2).map((a, i) => (
                    <AppointmentCard key={a.id} a={a} i={i} showRebook refIndex={6 + i} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* MOJE WIZYTY */}
        {activeTab === 'wizyty' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Moje wizyty</h1>
              <p className="text-sm text-gray-400 mt-1">Nadchodzące i aktywne rezerwacje</p>
            </div>
            <div className="flex justify-end mb-4">
              <button onClick={() => navigate('/booking')}
                className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1A7A6E] transition">
                + Nowa wizyta
              </button>
            </div>
            {loading ? <p className="text-sm text-gray-400">Ładowanie...</p> :
              upcoming.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-sm text-gray-400">
                  <p className="mb-4">Brak nadchodzących wizyt</p>
                  <button onClick={() => navigate('/booking')}
                    className="bg-[#2A9D8F] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1A7A6E] transition">
                    Zarezerwuj wizytę
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcoming.map((a, i) => (
                    <AppointmentCard key={a.id} a={a} i={i} showCancel refIndex={i} />
                  ))}
                </div>
              )}
          </>
        )}

        {/* HISTORIA */}
        {activeTab === 'historia' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Historia wizyt</h1>
              <p className="text-sm text-gray-400 mt-1">Poprzednie i odwołane wizyty</p>
            </div>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-sm text-gray-400">
                Brak historii wizyt
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((a, i) => (
                  <AppointmentCard key={a.id} a={a} i={i} showRebook refIndex={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Mój profil</h1>
              <p className="text-sm text-gray-400 mt-1">Twoje dane osobowe</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-2xl">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <span className="inline-block mt-1 text-xs bg-[#2A9D8F]/10 text-[#2A9D8F] px-2 py-0.5 rounded-full">Pacjent</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Imię', value: user.first_name },
                  { label: 'Nazwisko', value: user.last_name },
                  { label: 'Email', value: user.email },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}