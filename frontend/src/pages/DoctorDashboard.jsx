import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pulpit');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ slotDate: '', startTime: '', endTime: '' });
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
  }, [appointments, activeTab]);

  const fetchData = async () => {
    try {
      const [slotRes, serviceRes] = await Promise.all([
        api.get('/slots/my'),
        api.get('/services'),
      ]);
      setSlots(slotRes.data);
      setServices(serviceRes.data);
      
      // Pobierz wszystkie wizyty przez admin endpoint lub przez sloty
      try {
        const apptRes = await api.get('/admin/stats');
        // Użyj danych ze slotów żeby znaleźć rezerwacje
      } catch {}
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async () => {
    if (!newSlot.slotDate || !newSlot.startTime || !newSlot.endTime) return;
    try {
      await api.post('/slots', newSlot);
      setShowAddSlot(false);
      setNewSlot({ slotDate: '', startTime: '', endTime: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSlot = async (id) => {
	try {
		await api.delete(`/slots/${id}`);
		fetchData();
	} catch (err) {
		console.error(err);
	}
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySlots = slots.filter(s => s.slot_date?.startsWith(today));

  const statusLabel = {
    pending: { text: 'Oczekująca', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { text: 'Potwierdzona', color: 'bg-green-100 text-green-700' },
    cancelled: { text: 'Odwołana', color: 'bg-red-100 text-red-600' },
    completed: { text: 'Odbyta', color: 'bg-gray-100 text-gray-600' },
  };

  const tabs = [
    { id: 'pulpit', label: 'Pulpit', icon: '▣', section: 'MENU GŁÓWNE' },
    { id: 'rezerwacje', label: 'Rezerwacje', icon: '📅', section: null },
    { id: 'pacjenci', label: 'Pacjenci', icon: '👤', section: null },
    { id: 'sloty', label: 'Sloty czasowe', icon: '🕐', section: 'USTAWIENIA' },
    { id: 'uslugi', label: 'Usługi', icon: '🩺', section: null },
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

        <nav className="flex flex-col gap-1">
          {tabs.map(({ id, label, icon, section }) => (
            <div key={id}>
              {section && (
                <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2 px-2 mt-4">{section}</p>
              )}
              <button onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left w-full
                  ${activeTab === id ? 'bg-[#2A9D8F]/20 text-[#2A9D8F]' : 'text-white/60 hover:bg-white/5'}`}>
                <span>{icon}</span> {label}
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto">
          <button onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full text-left">
            <span>↩</span> Wyloguj się
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-56 flex-1 p-8">

        {/* PULPIT */}
        {activeTab === 'pulpit' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dzień dobry, {user.first_name}!</h1>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setActiveTab('sloty')}
                className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1A7A6E] transition">
                + Dodaj slot
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Dziś', value: todaySlots.length, sub: 'slotów zaplanowanych', color: 'text-gray-900' },
                { label: 'Sloty razem', value: slots.length, sub: 'wszystkich slotów', color: 'text-gray-900' },
                { label: 'Wolne sloty', value: slots.filter(s => s.is_available).length, sub: 'dostępnych', color: 'text-green-600' },
                { label: 'Usługi', value: services.length, sub: 'aktywnych usług', color: 'text-gray-900' },
              ].map(({ label, value, sub, color }, i) => (
                <div key={label} ref={el => cardsRef.current[i] = el}
                  className="card-animate hover-lift bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Sloty dziś */}
            <div className="grid grid-cols-2 gap-6">
              <div ref={el => cardsRef.current[4] = el} className="card-animate bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-4">Sloty - dziś</h2>
                {todaySlots.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Brak slotów na dziś</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {todaySlots.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}</p>
                          <p className="text-xs text-gray-400">{s.is_available ? 'Wolny' : 'Zajęty'}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${s.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.is_available ? 'Wolny' : 'Zajęty'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div ref={el => cardsRef.current[5] = el} className="card-animate bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-4">Usługi</h2>
                <div className="flex flex-col gap-2">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.duration_minutes} min</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">aktywna</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* SLOTY */}
        {activeTab === 'sloty' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sloty czasowe</h1>
                <p className="text-sm text-gray-400 mt-1">Zarządzaj dostępnymi terminami</p>
              </div>
              <button onClick={() => setShowAddSlot(!showAddSlot)}
                className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1A7A6E] transition">
                + Dodaj slot
              </button>
            </div>

            {showAddSlot && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Nowy slot</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Data</label>
                    <input type="date" value={newSlot.slotDate}
                      onChange={e => setNewSlot({ ...newSlot, slotDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2A9D8F]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Godzina od</label>
                    <input type="time" value={newSlot.startTime}
                      onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2A9D8F]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Godzina do</label>
                    <input type="time" value={newSlot.endTime}
                      onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2A9D8F]" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addSlot}
                    className="bg-[#2A9D8F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1A7A6E] transition">
                    Zapisz slot
                  </button>
                  <button onClick={() => setShowAddSlot(false)}
                    className="border border-gray-200 text-gray-500 px-5 py-2.5 rounded-xl text-sm hover:border-gray-300 transition">
                    Anuluj
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {loading ? <p className="text-sm text-gray-400 p-5">Ładowanie...</p> :
                slots.length === 0 ? <p className="text-sm text-gray-400 p-5 text-center">Brak slotów</p> : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="text-left p-4">Data</th>
                        <th className="text-left p-4">Godzina</th>
                        <th className="text-left p-4">Status</th>
						<th className="text-left p-4">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-700">{new Date(s.slot_date).toLocaleDateString('pl-PL')}</td>
                          <td className="p-4 text-sm text-gray-700">{s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${s.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {s.is_available ? 'Wolny' : 'Zajęty'}
                            </span>
                          </td>
						  <td className="p-4">
							{s.is_available && (
								<button onClick={() => deleteSlot(s.id)}
								className="text-xs text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
								Usuń
								</button>
							)}
							</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </>
        )}

        {/* USŁUGI */}
        {activeTab === 'uslugi' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Usługi</h1>
              <p className="text-sm text-gray-400 mt-1">Lista dostępnych usług medycznych</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="text-left p-4">Usługa</th>
                    <th className="text-left p-4">Czas trwania</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium text-gray-900">{s.name}</td>
                      <td className="p-4 text-sm text-gray-500">{s.duration_minutes} min</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">aktywna</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* REZERWACJE */}
        {activeTab === 'rezerwacje' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Rezerwacje</h1>
              <p className="text-sm text-gray-400 mt-1">Zajęte sloty to rezerwacje pacjentów</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {slots.filter(s => !s.is_available).length === 0 ? (
                <p className="text-sm text-gray-400 p-8 text-center">Brak rezerwacji</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="text-left p-4">Data</th>
                      <th className="text-left p-4">Godzina</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.filter(s => !s.is_available).map(s => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700">{new Date(s.slot_date).toLocaleDateString('pl-PL')}</td>
                        <td className="p-4 text-sm text-gray-700">{s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}</td>
                        <td className="p-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Zarezerwowany</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* PACJENCI */}
        {activeTab === 'pacjenci' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Pacjenci</h1>
              <p className="text-sm text-gray-400 mt-1">Lista zarejestrowanych pacjentów</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-sm text-gray-400">
              Lista pacjentów dostępna wkrótce
            </div>
          </>
        )}

      </main>
    </div>
  );
}