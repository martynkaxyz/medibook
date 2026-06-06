import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const DOCTOR_ID = 4;

export default function LandingPage() {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 120);
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach(card => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 w-full">
      <style>{`
        .card-animate {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .card-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(42,157,143,0.15);
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="w-full flex items-center justify-between px-16 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Medi<span className="text-[#2A9D8F]">Book</span>
        </span>
        <div className="hidden md:flex gap-8 text-sm text-gray-500 font-medium">
          <a href="#jak-to-dziala" onClick={(e) => scrollToSection(e, 'jak-to-dziala')} className="hover:text-[#2A9D8F] transition">Jak to działa</a>
          <a href="#dlaczego" onClick={(e) => scrollToSection(e, 'dlaczego')} className="hover:text-[#2A9D8F] transition">Dlaczego MediBook</a>
        </div>
        <button onClick={() => navigate('/login')}
          className="bg-[#2A9D8F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1A7A6E] transition">
          Zaloguj się
        </button>
      </nav>

      {/* HERO */}
      <section className="w-full px-16 py-24 bg-white flex items-center justify-between gap-16">
        <div className="max-w-xl">
          <span className="inline-block text-xs font-bold bg-[#2A9D8F]/10 text-[#2A9D8F] px-3 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Gabinet dr Neli Wysockiej
          </span>
          <h1 className="text-6xl font-bold leading-[1.1] mb-6 tracking-tight text-gray-900">
            Zdrowie na<br />
            <span className="text-[#2A9D8F]">wyciągnięcie</span><br />
            ręki
          </h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Zarezerwuj wizytę online w kilka sekund.<br />
            Bez kolejek, bez czekania na linii.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/booking')}
              className="bg-[#2A9D8F] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#1A7A6E] transition text-base">
              Zarezerwuj wizytę
            </button>
            <button onClick={() => navigate('/login')}
              className="border border-gray-200 text-gray-600 font-semibold px-8 py-4 rounded-2xl hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition text-base">
              Zaloguj się
            </button>
          </div>
          <div className="flex gap-8 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">✓</span>
              Potwierdzenie w 60 sekund
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center text-xs font-bold">✓</span>
              Bezpłatne odwołania
            </span>
          </div>
        </div>

        {/* PRAWA STRONA HERO - dekoracja */}
        <div className="hidden lg:flex relative w-96 h-96 flex-shrink-0">
          <div className="absolute inset-0 bg-[#2A9D8F]/10 rounded-3xl" />
          <div className="absolute top-8 right-8 w-32 h-32 bg-[#2A9D8F]/20 rounded-2xl" />
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-[#2A9D8F]/30 rounded-2xl" />
          <div className="absolute inset-8 bg-[#2A9D8F] rounded-2xl flex flex-col items-center justify-center text-white gap-3">
            <div className="text-5xl font-bold">500+</div>
            <div className="text-sm font-medium text-white/80">zadowolonych pacjentów</div>
            <div className="w-12 h-0.5 bg-white/30 my-1" />
            <div className="text-3xl font-bold">4.9★</div>
            <div className="text-sm font-medium text-white/80">średnia ocen</div>
          </div>
        </div>
      </section>

      {/* JAK TO DZIAŁA */}
      <section id="jak-to-dziala" className="w-full px-16 py-20 bg-gray-50">
        <div className="mb-12">
          <span className="inline-block text-xs text-[#2A9D8F] font-bold uppercase tracking-wider bg-[#2A9D8F]/10 px-3 py-1 rounded-full mb-4">
            Jak to działa
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Trzy kroki od wizyty</h2>
          <p className="text-gray-400">Prosto i bez komplikacji</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Wybierz usługę', desc: 'Konsultacja ogólna, EKG, badanie kontrolne i wiele innych.', color: 'bg-[#2A9D8F]' },
            { num: '02', title: 'Wybierz termin', desc: 'Przeglądaj dostępne sloty i wybierz pasującą datę i godzinę.', color: 'bg-[#1A7A6E]' },
            { num: '03', title: 'Gotowe!', desc: 'Email z potwierdzeniem i przypomnieniem przed wizytą.', color: 'bg-[#0F5A50]' },
          ].map(({ num, title, desc, color }, i) => (
            <div
              key={num}
              ref={el => cardsRef.current[i] = el}
              className="card-animate hover-lift bg-white rounded-3xl p-8 border border-gray-100"
            >
              <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-6`}>
                {num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DLACZEGO MEDIBOOK */}
      <section id="dlaczego" className="w-full px-16 py-20 bg-white">
        <div className="mb-12">
          <span className="inline-block text-xs text-[#2A9D8F] font-bold uppercase tracking-wider bg-[#2A9D8F]/10 px-3 py-1 rounded-full mb-4">
            Dlaczego MediBook
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Zdrowie pod kontrolą</h2>
          <p className="text-gray-400">Wszystko czego potrzebujesz w jednym miejscu</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '🕐', title: 'Dostępne 24/7', desc: 'Rezerwuj wizyty o każdej porze dnia i nocy - bez czekania na otwarcie recepcji.' },
            { icon: '📅', title: 'Historia wizyt', desc: 'Wszystkie Twoje wizyty w jednym miejscu. Przeglądaj historię i umawiaj ponownie.' },
            { icon: '🔔', title: 'Przypomnienia', desc: 'Automatyczne powiadomienia email przed każdą wizytą. Nigdy więcej zapomnianych terminów.' },
            { icon: '✕', title: 'Bezpłatne odwołania', desc: 'Plany się zmieniają - odwołaj wizytę bez żadnych opłat w dowolnym momencie.' },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={title}
              ref={el => cardsRef.current[3 + i] = el}
              className="card-animate hover-lift flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#2A9D8F]/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-16 py-20 bg-[#2A9D8F]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Gotowy na zdrowie<br />bez kolejek?</h2>
          <p className="text-white/70 mb-10 text-lg">Dołącz do setek pacjentów którzy już korzystają z MediBook</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/booking')}
              className="bg-white text-[#2A9D8F] font-bold px-10 py-4 rounded-2xl hover:bg-gray-50 transition text-base">
              Zarezerwuj teraz - to nic nie kosztuje
            </button>
          </div>
          <p className="text-white/50 text-sm mt-6">Rejestracja zajmuje mniej niż minutę</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-gray-900 text-white px-16 py-8 flex justify-between items-center">
        <span className="font-bold text-lg">Medi<span className="text-[#2A9D8F]">Book</span></span>
        <span className="text-gray-400 text-sm">© 2026 MediBook · Gabinet dr Neli Wysockiej</span>
      </footer>
    </div>
  );
}