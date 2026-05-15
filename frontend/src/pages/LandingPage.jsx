import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Przykładowa baza dostępnych dni dla różnych miesięcy (klucz: "ROK-MIESIĄC")
const AVAILABLE_DATES_DB = {
  "2026-6": [1, 2, 5, 8, 9, 12, 15, 16, 19, 22, 23, 26, 29, 30], // Czerwiec 2026
  "2026-7": [14, 15, 16, 17, 20, 21, 22, 24, 27, 28, 29, 30, 31], // Lipiec 2026
  "2026-8": [3, 4, 5, 10, 11, 12, 17, 18, 24, 25, 26, 31]         // Sierpień 2026
};

const MONTHS_LABELS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const SLOTS_ALL = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const SLOTS_AVAILABLE = ['10:00', '11:00', '12:00', '14:00', '15:00'];

export default function LandingPage() {
  const navigate = useNavigate();

  // Stan aktualnie wyświetlanego miesiąca i roku na kalendarzu (Start: Lipiec 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // 6 to Lipiec w JS (0-11)
  
  // Stan wybranego dnia i godziny
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 1. Obliczanie parametrów kalendarza dla wybranego miesiąca
  const { daysInMonth, monthOffset, availableDays } = useMemo(() => {
    // Liczba dni w miesiącu
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Dzień tygodnia pierwszego dnia miesiąca (0 - Niedziela, 1 - Poniedziałek...)
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Konwersja na format europejski (0 - Poniedziałek, 6 - Niedziela)
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Pobranie dostępnych dni z "bazy" dla danego miesiąca
    const dbKey = `${currentYear}-${currentMonth + 1}`;
    const avDays = AVAILABLE_DATES_DB[dbKey] || [];

    return { daysInMonth: days, monthOffset: offset, availableDays: avDays };
  }, [currentYear, currentMonth]);

  // 2. Obsługa przełączania miesięcy
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  // 3. Płynne przewijanie do sekcji (Smooth Scroll)
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const odmienMiesiac = (m) => ({
	'Styczeń':'stycznia','Luty':'lutego','Marzec':'marca','Kwiecień':'kwietnia',
	'Maj':'maja','Czerwiec':'czerwca','Lipiec':'lipca','Sierpień':'sierpnia',
	'Wrzesień':'września','Październik':'października','Listopad':'listopada','Grudzień':'grudnia'
})[m] || m;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 w-full flex flex-col items-stretch">
      
      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-8 pl-16 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
		<span className="text-xl font-bold tracking-tight text-[#1E293B]">
			Medi<span className="text-[#2A9D8F]">Book</span>
		</span>

		{/* Desktop */}
		<div className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
			<a href="#jak-to-dziala" onClick={(e) => scrollToSection(e, 'jak-to-dziala')} className="hover:text-[#2A9D8F] transition">Jak to działa</a>
			<a href="#kalendarz" onClick={(e) => scrollToSection(e, 'kalendarz')} className="hover:text-[#2A9D8F] transition">Umów wizytę</a>
		</div>

		<div className="flex items-center gap-3">
			<button
			onClick={() => navigate('/login')}
			className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1A7A6E] transition"
			>
			Zaloguj się
			</button>
			{/* Hamburger - tylko mobile */}
			<button
			className="md:hidden flex flex-col gap-1.5 p-1"
			onClick={() => setMenuOpen(!menuOpen)}
			>
			<span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
			<span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
			<span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
			</button>
		</div>

		{/* Mobile menu */}
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
            <a
              href="#kalendarz"
              onClick={(e) => scrollToSection(e, 'kalendarz')}
              className="bg-white text-[#2A9D8F] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-gray-50 transition shadow-sm block text-center"
            >
              Zarezerwuj wizytę
            </a>
            <a 
              href="#jak-to-dziala"
              onClick={(e) => scrollToSection(e, 'jak-to-dziala')}
              className="border border-white/40 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition block text-center"
            >
              Dowiedz się więcej
            </a>
          </div>
        </div>
      </section>

      {/* PASEK SZYBKICH INFORMACJI */}
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
        <h2 id="uslugi" className="text-3xl font-bold text-gray-900 mb-1 tracking-tight scroll-mt-20">Trzy kroki od wizyty</h2>
        <p className="text-sm text-gray-500 mb-10">Prosto i bez komplikacji</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left flex flex-col items-start">
            <p className="text-sm font-bold text-[#2A9D8F] mb-4">01</p>
            <div className="w-12 h-12 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303.197-1.591 1.591M21.75 12h-2.25m-.197 5.303-1.591-1.591M12 21.75V19.5m-5.303-.197 1.591-1.591M2.25 12h2.25m.197-5.303 1.591 1.591" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">Wybierz usługę</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Konsultacja ogólna, EKG, badanie kontrolne i inne.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left flex flex-col items-start">
            <p className="text-sm font-bold text-[#2A9D8F] mb-4">02</p>
            <div className="w-12 h-12 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">Wybierz termin</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Przeglądaj dostępne sloty i wybierz pasującą godzinę.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left flex flex-col items-start">
            <p className="text-sm font-bold text-[#2A9D8F] mb-4">03</p>
            <div className="w-12 h-12 bg-[#2A9D8F] text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-base">Gotowe</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Email z potwierdzeniem i przypomnieniem przed wizytą.</p>
          </div>
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
          {/* Nagłówek miesiąca */}
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-lg text-gray-900">{MONTHS_LABELS[currentMonth]} {currentYear}</span>
            <div className="flex gap-3">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/10 transition"
              >
                ‹
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/10 transition"
              >
                ›
              </button>
            </div>
          </div>

          {/* Dni kalendarza (dynamicznie generowane) */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-3">
            {/* Puste kafelki wynikające z przesunięcia miesiąca */}
            {Array.from({ length: monthOffset }).map((_, i) => <div key={`e-${i}`} />)}
            
            {/* Iteracja po faktycznych dniach miesiąca */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const isAvail = availableDays.includes(d);
              const isSel = d === selectedDay;
              return (
                <button 
                  key={d} 
                  onClick={() => isAvail && handleDaySelect(d)}
                  disabled={!isAvail}
                  className={`aspect-square rounded-xl text-sm font-bold transition-all flex items-center justify-center
                    ${isSel 
                      ? 'bg-[#2A9D8F] text-white shadow-md shadow-[#2A9D8F]/20' 
                      : isAvail 
                        ? 'bg-[#E6F4F2] text-[#2A9D8F] hover:bg-[#2A9D8F]/20' 
                        : 'text-gray-400 font-normal cursor-default'}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dostępne godziny */}
        {selectedDay ? (
          <div className="w-full max-w-4xl transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
              Dostępne godziny · {selectedDay} {odmienMiesiac(MONTHS_LABELS[currentMonth])}
            </p>
            <div className="flex gap-3 flex-wrap mb-10 w-full">
              {SLOTS_ALL.map(slot => {
                const isAvail = SLOTS_AVAILABLE.includes(slot);
                const isSel = slot === selectedSlot;
                return (
                  <button 
                    key={slot} 
                    onClick={() => isAvail && setSelectedSlot(slot)}
                    disabled={!isAvail}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-200
                      ${isSel 
                        ? 'bg-[#2A9D8F] text-white border-[#2A9D8F] shadow-sm' 
                        : isAvail 
                          ? 'border-[#2A9D8F] text-[#2A9D8F] bg-white hover:bg-[#2A9D8F]/5' 
                          : 'border-gray-200 text-gray-300 bg-white cursor-default'}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => selectedSlot && navigate('/login')}
              disabled={!selectedSlot}
              className={`w-full bg-[#2A9D8F] text-white py-3 rounded-2xl font-bold text-base transition-all duration-300 text-center block
                ${selectedSlot 
                  ? 'hover:bg-[#1A7A6E] shadow-md shadow-[#2A9D8F]/10 opacity-100 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'}`}
            >
              {selectedSlot 
                ? `Zarezerwuj · ${selectedDay} ${odmienMiesiac(MONTHS_LABELS[currentMonth])}, ${selectedSlot}`
                : 'Wybierz godzinę wizyty'
              }
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-center text-sm text-gray-400 font-medium">
            Wybierz dostępny dzień z kalendarza, aby zobaczyć godziny wizyt.
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer id="stopka" className="w-full bg-[#2A9D8F] text-white px-16 py-3 flex justify-between items-center scroll-mt-20">
        <span className="font-bold text-xl tracking-tight">MediBook</span>
        <span className="text-white/80 text-sm">© 2026 MediBook</span>
      </footer>

    </div>
  );
}