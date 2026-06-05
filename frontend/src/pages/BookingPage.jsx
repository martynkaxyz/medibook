import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MONTHS_LABELS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const odmienMiesiac = (m) => ({
  'Styczeń':'stycznia','Luty':'lutego','Marzec':'marca','Kwiecień':'kwietnia',
  'Maj':'maja','Czerwiec':'czerwca','Lipiec':'lipca','Sierpień':'sierpnia',
  'Wrzesień':'września','Październik':'października','Listopad':'listopada','Grudzień':'grudnia'
})[m] || m;

const DOCTOR_ID = 1;

export default function BookingPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data));
  }, []);

  useEffect(() => {
    fetchAvailableDates();
  }, [currentDate]);

  const fetchAvailableDates = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const promises = Array.from({ length: daysInMonth }, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${day}`;
        return api.get(`/slots?doctorId=${DOCTOR_ID}&date=${date}`);
      });
      const results = await Promise.all(promises);
      const days = [];
      results.forEach((res, i) => { if (res.data.length > 0) days.push(i + 1); });
      setAvailableDates(days);
    } catch (err) { console.error(err); }
  };

  const fetchSlots = async (day) => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const res = await api.get(`/slots?doctorId=${DOCTOR_ID}&date=${date}`);
      setAvailableSlots(res.data);
      setSelectedSlot(null);
    } catch (err) { console.error(err); }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    fetchSlots(day);
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!selectedSlot || !selectedService) return;
    setBooking(true);
    try {
      await api.post('/appointments', {
        slotId: selectedSlot.id,
        serviceId: selectedService.id,
      });
      setBookingSuccess(true);
    } catch (err) { console.error(err); }
    finally { setBooking(false); }
  };

  const { daysInMonth, monthOffset } = useMemo(() => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth: days, monthOffset: offset };
  }, [currentYear, currentMonth]);

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wizyta zarezerwowana!</h2>
          <p className="text-gray-400 text-sm mb-2">
            {selectedService?.name} · {selectedDay} {odmienMiesiac(MONTHS_LABELS[currentMonth])} · {selectedSlot?.start_time?.slice(0,5)}
          </p>
          <p className="text-gray-400 text-sm mb-8">dr Nela Wysocka · Medycyna ogólna</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/dashboard')}
              className="bg-[#2A9D8F] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-[#1A7A6E] transition">
              Przejdź do dashboardu
            </button>
            <button onClick={() => { setBookingSuccess(false); setSelectedDay(null); setSelectedSlot(null); setStep(1); }}
              className="border border-gray-200 text-gray-500 px-6 py-3 rounded-2xl font-semibold text-sm hover:border-[#2A9D8F] transition">
              Zarezerwuj kolejną
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="w-full flex items-center justify-between px-16 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <span className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>
        <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-[#2A9D8F] transition">
          ← Wróć do strony głównej
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zarezerwuj wizytę</h1>
          <p className="text-gray-400">Gabinet dr Neli Wysockiej · Medycyna ogólna</p>
        </div>

        {/* STEPS */}
        <div className="flex items-center gap-4 mb-10">
          {['Wybierz usługę', 'Wybierz termin', 'Potwierdź'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${step > i + 1 ? 'bg-[#2A9D8F] text-white' : step === i + 1 ? 'bg-[#2A9D8F] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200 ml-1" />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Wybierz rodzaj wizyty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setStep(2); }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#2A9D8F] text-left transition group">
                  <div className="w-10 h-10 bg-[#2A9D8F]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2A9D8F] transition">
                    <span className="text-[#2A9D8F] group-hover:text-white text-lg">🩺</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
                  <p className="text-xs text-gray-400">{s.duration_minutes} min</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">Wybierz datę</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setCurrentDate(new Date(currentYear, currentMonth - 1, 1)); setSelectedDay(null); }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition">‹</button>
                  <button onClick={() => { setCurrentDate(new Date(currentYear, currentMonth + 1, 1)); setSelectedDay(null); }}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition">›</button>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">{MONTHS_LABELS[currentMonth]} {currentYear}</p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-7 gap-1">
                  {['Pn','Wt','Śr','Cz','Pt','So','Nd'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-2">{d}</div>
                  ))}
                  {Array.from({ length: monthOffset }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const isAvail = availableDates.includes(d);
                    const isSel = d === selectedDay;
                    return (
                      <button key={d} onClick={() => isAvail && handleDaySelect(d)} disabled={!isAvail}
                        className={`aspect-square rounded-xl text-sm font-medium transition flex items-center justify-center
                          ${isSel ? 'bg-[#2A9D8F] text-white' : isAvail ? 'bg-[#2A9D8F]/10 text-[#2A9D8F] hover:bg-[#2A9D8F]/20' : 'text-gray-300 cursor-default'}`}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Wybierz godzinę</h2>
              {!selectedDay ? (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-sm text-gray-400">
                  Najpierw wybierz dzień z kalendarza
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center text-sm text-gray-400">
                  Brak wolnych slotów w tym dniu
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {availableSlots.map(slot => {
                      const isSel = selectedSlot?.id === slot.id;
                      return (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                          className={`py-3 rounded-xl text-sm font-bold border-2 transition
                            ${isSel ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]' : 'border-gray-200 text-gray-700 hover:border-[#2A9D8F] hover:text-[#2A9D8F]'}`}>
                          {slot.start_time?.slice(0,5)}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSlot && (
                    <div className="bg-[#2A9D8F]/5 border border-[#2A9D8F]/20 rounded-2xl p-5 mb-6">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Podsumowanie</p>
                      <p className="text-xs text-gray-500">{selectedService?.name}</p>
                      <p className="text-xs text-gray-500">{selectedDay} {odmienMiesiac(MONTHS_LABELS[currentMonth])} · {selectedSlot.start_time?.slice(0,5)}</p>
                      <p className="text-xs text-gray-500">dr Nela Wysocka · {selectedService?.duration_minutes} min</p>
                    </div>
                  )}
                  <button onClick={handleBooking} disabled={!selectedSlot || booking}
                    className={`w-full bg-[#2A9D8F] text-white py-4 rounded-2xl font-bold text-sm transition
                      ${selectedSlot && !booking ? 'hover:bg-[#1A7A6E]' : 'opacity-50 cursor-not-allowed'}`}>
                    {booking ? 'Rezerwowanie...' : 'Potwierdź rezerwację'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-400 hover:text-[#2A9D8F] transition">
            ← Zmień usługę
          </button>
        )}
      </div>
    </div>
  );
}