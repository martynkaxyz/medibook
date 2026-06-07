import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Field = ({ name, label, type = 'text', form, setForm, errors }) => (
  <div className="relative">
    <input
      type={type}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      placeholder=" "
      className={`w-full border-2 rounded-2xl px-4 pt-5 pb-2 text-sm outline-none transition-all peer bg-gray-50 focus:bg-white
        ${errors[name] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#2A9D8F]'}`}
    />
    <label className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#2A9D8F]
      peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs">
      {label}
    </label>
    {errors[name] && <p className="text-xs text-red-500 mt-1 ml-1">{errors[name]}</p>}
  </div>
);

export default function LoginPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/dashboard');
    }
  }, []);

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email jest wymagany';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Podaj poprawny email';
    if (!form.password) e.password = 'Hasło jest wymagane';
    else if (form.password.length < 8) e.password = 'Hasło musi mieć min. 8 znaków';
    if (tab === 'register') {
      if (!form.first_name) e.first_name = 'Imię jest wymagane';
      if (!form.last_name) e.last_name = 'Nazwisko jest wymagane';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Hasła nie są zgodne';
    }
    return e;
  };

  const handleSubmit = async () => {
    setApiError('');
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, first_name: form.first_name, last_name: form.last_name };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'doctor') navigate('/doctor');
      else navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.4s ease forwards; }
      `}</style>

      {/* LEWA STRONA */}
      <div className="hidden md:flex w-1/2 bg-[#2A9D8F] text-white flex-col justify-between p-14 relative overflow-hidden rounded-r-3xl">
        <div className="absolute right-[-60px] top-[-60px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute right-16 top-16 w-28 h-56 bg-white/8 rounded-full rotate-[35deg]" />
        <div className="absolute right-[-20px] bottom-20 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute left-[-40px] bottom-[-40px] w-48 h-48 bg-white/5 rounded-full" />

        <span className="text-2xl font-bold relative z-10">
          Medi<span className="text-white/60">Book</span>
        </span>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Zadbaj o zdrowie<br />na własnych<br />warunkach
          </h2>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Dołącz do pacjentów, którzy umawiają wizyty online - szybko i bez stresu.
          </p>

          <div className="flex flex-col gap-3 text-sm text-white/70">
            {['Rezerwacja 24/7 - bez czekania', 'Historia wizyt w jednym miejscu', 'Przypomnienie email przed wizytą', 'Bezpłatne odwołanie wizyty'].map(item => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <span className="text-white/30 text-xs relative z-10">© 2026 MediBook</span>
      </div>

      {/* PRAWA STRONA */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-white">
        <div className="fade-in">
          <div className="flex justify-end mb-10">
            <a href="/" className="text-sm text-gray-400 hover:text-[#2A9D8F] transition flex items-center gap-1">
              ← Wróć do strony głównej
            </a>
          </div>

          {/* TABS */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8 max-w-sm">
            <button onClick={() => { setTab('login'); setApiError(''); setErrors({}); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition
                ${tab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              Logowanie
            </button>
            <button onClick={() => { setTab('register'); setApiError(''); setErrors({}); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition
                ${tab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              Rejestracja
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            {tab === 'login' ? 'Witaj ponownie!' : 'Zarejestruj się'}
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            {tab === 'login' ? 'Zaloguj się, aby zarządzać wizytami' : 'Stwórz nowe konto pacjenta'}
          </p>

          {apiError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5">
              {apiError}
            </div>
          )}

          <div className="flex flex-col gap-4 max-w-sm">
            {tab === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <Field name="first_name" label="Imię" form={form} setForm={setForm} errors={errors} />
                <Field name="last_name" label="Nazwisko" form={form} setForm={setForm} errors={errors} />
              </div>
            )}

            <Field name="email" label="Adres email" type="email" form={form} setForm={setForm} errors={errors} />

            <div>
              <Field name="password" label="Hasło" type="password" form={form} setForm={setForm} errors={errors} />
            </div>

            {tab === 'register' && (
              <Field name="confirmPassword" label="Potwierdź hasło" type="password" form={form} setForm={setForm} errors={errors} />
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-[#2A9D8F] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#1A7A6E] transition disabled:opacity-50 mt-2">
              {loading
                ? (tab === 'login' ? 'Logowanie...' : 'Rejestracja...')
                : (tab === 'login' ? 'Zaloguj się' : 'Zarejestruj się')}
            </button>

            {tab === 'login' && (
              <p className="text-center text-sm text-gray-400">
                Nie masz konta?{' '}
                <button onClick={() => { setTab('register'); setApiError(''); setErrors({}); }}
                  className="text-[#2A9D8F] font-semibold hover:underline">
                  Zarejestruj się
                </button>
              </p>
            )}
            {tab === 'register' && (
              <p className="text-center text-sm text-gray-400">
                Masz już konto?{' '}
                <button onClick={() => { setTab('login'); setApiError(''); setErrors({}); }}
                  className="text-[#2A9D8F] font-semibold hover:underline">
                  Zaloguj się
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}