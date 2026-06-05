import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MONTHS_LABELS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const DOCTOR_ID = 1;

const odmienMiesiac = (m) => ({
  'Styczeń':'stycznia','Luty':'lutego','Marzec':'marca','Kwiecień':'kwietnia',
  'Maj':'maja','Czerwiec':'czerwca','Lipiec':'lipca','Sierpień':'sierpnia',
  'Wrzesień':'września','Październik':'października','Listopad':'listopada','Grudzień':'grudnia'
})[m] || m;

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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
      results.forEach((res, i) => {
        if (res.data.length > 0) days.push(i + 1);
      });
      setAvailableDates(days);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async (day) => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const res = await api.get(`/slots?doctorId=${DOCTOR_ID}&date=${date}`);
      setAvailableSlots(res.data);
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    fetchSlots(day);
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!selectedSlot) return;
    setBooking(true);
    try {
      await api.post('/appointments', {
        slotId: selectedSlot.id,
        serviceId: 1,
      });
      setBookingSuccess(true);
      fetchAvailableDates();
    } catch (err) {
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  const { daysInMonth, monthOffset } = useMemo(() => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    return { daysInMonth: days, monthOffset: offset };
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setBookingSuccess(false);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setBookingSuccess(false);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 w-full flex flex-col items-stretch">

      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-8 pl-16 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <span className="text-xl font-bold tracking-tight text-[#1E293B]">
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>
        <div className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
          <a href="#jak-to-dziala" onClick={(e) => scrollToSection(e, 'jak-to-dziala')} className="hover:text-[#2A9D8F] transition">Jak to działa</a>
          <a href="#kalendarz" onClick={(e) => scrollToSection(e, 'kalendarz')} className="hover:text-[#2A9D8F] transition">Umów wizytę</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1A7A6E] transition">
            Zaloguj się
          </button>
          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 flex flex-col px-8 py-4 gap-4 md:hidden shadow-sm">
            <a href="#jak-to-dziala" onClick={(e) => { scrollToSection(e, 'jak-to-dziala'); setMenuOpen(false); }}
              className="text-sm font-medium text-gray-600 hover:text-[#2A9D8F]">Jak to działa</a>
            <a href="#kalendarz" onClick={(e) => { scrollToSection(e, 'kalendarz'); setMenuOpen(false); }}
              className="text-sm font-medium text-gray-600 hover:text-[#2A9D8F]">Umów wizytę</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative w-full bg-[#2A9D8F] text-white px-16 py-12 overflow-hidden flex justify-start items-center text-left">
        <div className="absolute right-[-50px] top-[-20px] w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-12 top-10 w-24 h-48 bg-white/10 rounded-full rotate-[35deg] pointer-events-none" />
        <div className="absolute right-36 top-32 w-20 h-40 bg-white/10 rounded-full rotate-[35deg] pointer-events-none" />
        <div className="absolute right-16 bottom-[-40px] w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="max-w-xl relative z-10 flex flex-col items-start w-full">
          <span className="inline-block text-xs font-bold bg-white/20 px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase text-white">
            Gabinet dr Neli Wysockiej
          </span>
          <h1 className="text-5xl font-bold leading-[1.15] mb-5 tracking-tight">
            Zdrowie na<br />wyciągnięcie ręki
          </h1>
          <p className="text-white/90 text-base mb-10 leading-relaxed font-light">
            Zarezerwuj wizytę online w kilka sekund.<br />
            Bez kolejek, bez czekania na linii.
          </p>
          <div className="flex gap-4 justify-start">
            <a href="#kalendarz" onClick={(e) => scrollToSection(e, 'kalendarz')}
              className="bg-white text-[#2A9D8F] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition shadow-sm block text-center">
              Zarezerwuj wizytę
            </a>
            <a href="#jak-to-dziala" onClick={(e) => scrollToSection(e, 'jak-to-dziala')}
              className="border border-white/40 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition block text-center">
              Dowiedz się więcej
            </a>
          </div>
        </div>
      </section>

      {/* PASEK */}
      <section className="w-full flex flex-wrap gap-6 px-8 pl-16 py-5 bg-white border-b border-gray-100 text-sm font-medium text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">✓</span>
          Potwierdzenie w 60 sekund
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">✓</span>
          Bezpłatne odwołanie
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">✓</span>
          Przypomnienie email
        </span>
      </section>

      {/* JAK TO DZIAŁA */}
      <section id="jak-to-dziala" className="w-full px-16 py-10 bg-[#F4F9F8] scroll-mt-20">
        <span className="inline-block text-xs text-[#2A9D8F] font-bold uppercase tracking-wider bg-[#2A9D8F]/10 px-3 py-1 rounded-full mb-3">
          Jak to działa
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Trzy kroki od wizyty</h2>
        <p className="text-sm text-gray-500 mb-10">Prosto i bez komplikacji</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Wybierz usługę', desc: 'Konsultacja ogólna, EKG, badanie kontrolne i inne.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303.197-1.591 1.591M21.75 12h-2.25m-.197 5.303-1.591-1.591M12 21.75V19.5m-5.303-.197 1.591-1.591M2.25 12h2.25m.197-5.303 1.591 1.591" /> },
            { num: '02', title: 'Wybierz termin', desc: 'Przeglądaj dostępne sloty i wybierz pasującą godzinę.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /> },
            { num: '03', title: 'Gotowe', desc: 'Email z potwierdzeniem i przypomnieniem przed wizytą.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /> },
          ].map(({ num, title, desc, icon }) => (
            <div key={num} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left flex flex-col items-start">
              <p className="text-sm font-bold text-[#2A9D8F] mb-4">{num}</p>
              <div className="w-12 h-12 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{icon}</svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KALENDARZ */}
      <section id="kalendarz" className="w-full px-16 py-10 bg-[#F4F9F8] text-left flex flex-col items-start scroll-mt-20">
        <span className="inline-block text-xs text-[#2A9D8F] font-bold uppercase tracking-wider bg-[#2A9D8F]/10 px-3 py-1 rounded-full mb-3">
          Dostępne terminy
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Wybierz datę wizyty</h2>
        <p className="text-sm text-gray-500 mb-8">{MONTHS_LABELS[currentMonth]} {currentYear} · Konsultacja ogólna</p>

        <div className="w-full bg-white rounded-3xl p-6 mb-8 shadow-sm max-w-4xl border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg text-gray-900">{MONTHS_LABELS[currentMonth]} {currentYear}</span>
            <div className="flex gap-3">
              <button onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/10 transition">‹</button>
              <button onClick={handleNextMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/10 transition">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-3">
            {Array.from({ length: monthOffset }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const isAvail = availableDates.includes(d);
              const isSel = d === selectedDay;
              return (
                <button key={d} onClick={() => isAvail && handleDaySelect(d)} disabled={!isAvail}
                  className={`aspect-square rounded-xl text-sm font-bold transition-all flex items-center justify-center
                    ${isSel ? 'bg-[#2A9D8F] text-white shadow-md' : isAvail ? 'bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/20' : 'text-gray-400 font-normal cursor-default'}`}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDay ? (
          <div className="w-full max-w-4xl">
            <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
              Dostępne godziny · {selectedDay} {odmienMiesiac(MONTHS_LABELS[currentMonth])}
            </p>
            <div className="flex gap-3 flex-wrap mb-10">
              {availableSlots.length === 0 ? (
                <p className="text-sm text-gray-400">Brak wolnych slotów w tym dniu</p>
              ) : (
                availableSlots.map(slot => {
                  const isSel = selectedSlot?.id === slot.id;
                  return (
                    <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold border transition
                        ${isSel ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]' : 'border-[#2A9D8F] text-[#2A9D8F] bg-white hover:bg-[#2A9D8F]/5'}`}>
                      {slot.start_time?.slice(0, 5)}
                    </button>
                  );
                })
              )}
            </div>

            {bookingSuccess ? (
              <div className="w-full max-w-4xl bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-green-700 font-semibold">✓ Wizyta zarezerwowana!</p>
                <p className="text-green-600 text-sm mt-1">Sprawdź swój dashboard aby zobaczyć szczegóły.</p>
                <button onClick={() => navigate('/dashboard')}
                  className="mt-4 bg-[#2A9D8F] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1A7A6E] transition">
                  Przejdź do dashboardu
                </button>
              </div>
            ) : (
              <button onClick={handleBooking} disabled={!selectedSlot || booking}
                className={`w-full max-w-4xl bg-[#2A9D8F] text-white py-3 rounded-2xl font-bold text-base transition text-center block
                  ${selectedSlot && !booking ? 'hover:bg-[#1A7A6E] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                {booking ? 'Rezerwowanie...' : selectedSlot
                  ? `Zarezerwuj · ${selectedDay} ${odmienMiesiac(MONTHS_LABELS[currentMonth])}, ${selectedSlot.start_time?.slice(0, 5)}`
                  : 'Wybierz godzinę wizyty'}
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400 font-medium">
            Wybierz dostępny dzień z kalendarza, aby zobaczyć godziny wizyt.
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer id="stopka" className="w-full bg-[#2A9D8F] text-white px-16 py-3 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight">MediBook</span>
        <span className="text-white/80 text-sm">© 2026 MediBook</span>
      </footer>
    </div>
  );
}