import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* LEWA STRONA - zielona */}
      <div className="hidden md:flex w-1/2 bg-[#2A9D8F] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute right-20 top-20 w-20 h-40 bg-white/10 rounded-full rotate-[35deg]" />
        <div className="absolute right-[-20px] bottom-20 w-48 h-48 bg-white/10 rounded-full" />

        <span className="text-2xl font-bold">MediBook</span>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Zadbaj o zdrowie<br />na własnych<br />warunkach
          </h2>
          <p className="text-white/70 text-sm mb-10">
            Dołącz do pacjentów, którzy umawiają wizyty online<br />- szybko i bez stresu.
          </p>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <span className="flex items-center gap-2"><span className="text-white">✓</span> Rezerwacja 24/7 - bez czekania</span>
            <span className="flex items-center gap-2"><span className="text-white">✓</span> Historia wizyt w jednym miejscu</span>
            <span className="flex items-center gap-2"><span className="text-white">✓</span> Przypomnienie email przed wizytą</span>
            <span className="flex items-center gap-2"><span className="text-white">✓</span> Bezpłatne odwołanie wizyty</span>
          </div>
        </div>

        <span className="text-white/40 text-xs">© 2026 MediBook</span>
      </div>

      {/* PRAWA STRONA - formularz */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16">
        <div className="flex justify-end mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-[#2A9D8F] transition">
            ← Wróć do strony głównej
          </a>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-xl p-1 mb-8 max-w-sm">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition
              ${tab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
          >
            Logowanie
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition
              ${tab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
          >
            Rejestracja
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-1">{tab === 'login' ? 'Witaj ponownie!' : 'Zarejestruj się'}</h1>
		<p className="text-sm text-gray-400 mb-8">{tab === 'login' ? 'Zaloguj się, aby zarządzać wizytami' : 'Stwórz nowe konto pacjenta'}</p>

		{error && (
		<div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
			{error}
		</div>
		)}

		<div className="flex flex-col gap-4 max-w-sm">
		<div className="relative">
			<input
			type="email"
			value={form.email}
			onChange={(e) => setForm({ ...form, email: e.target.value })}
			placeholder=" "
			className="w-full border border-gray-200 rounded-xl px-4 pt-5 pb-2 text-sm outline-none focus:border-[#2A9D8F] transition peer"
			/>
			<label className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#2A9D8F] peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs">
			Adres email
			</label>
		</div>

		<div className="relative">
			<input
			type="password"
			value={form.password}
			onChange={(e) => setForm({ ...form, password: e.target.value })}
			placeholder=" "
			className="w-full border border-gray-200 rounded-xl px-4 pt-5 pb-2 text-sm outline-none focus:border-[#2A9D8F] transition peer"
			/>
			<label className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#2A9D8F] peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs">
			Hasło
			</label>
			<div className="flex justify-end mt-1">
			<a href="#" className="text-xs text-[#2A9D8F] hover:underline">Nie pamiętasz hasła?</a>
			</div>
		</div>

		<button
			onClick={handleSubmit}
			disabled={loading}
			className="w-full bg-[#2A9D8F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1A7A6E] transition disabled:opacity-50"
		>
			{loading ? (tab === 'login' ? 'Logowanie...' : 'Rejestracja...') : (tab === 'login' ? 'Zaloguj się' : 'Zarejestruj się')}
		</button>

		{tab === 'login' && (
		<p className="text-center text-sm text-gray-400">
			Nie masz konta?{' '}
			<button onClick={() => setTab('register')} className="text-[#2A9D8F] font-semibold hover:underline">
			Zarejestruj się
			</button>
		</p>
		)}

		{tab === 'register' && (
		<p className="text-center text-sm text-gray-400">
			Masz już konto?{' '}
			<button onClick={() => setTab('login')} className="text-[#2A9D8F] font-semibold hover:underline">
			Zaloguj się
			</button>
		</p>
		)}
		</div>
      </div>
    </div>
  );
}