import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Field = ({ name, label, type = 'text', form, setForm, errors }) => (
  <div className="relative">
    <input
      type={type}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      placeholder=" "
      className={`w-full border rounded-xl px-4 pt-5 pb-2 text-sm outline-none transition peer
        ${errors[name] ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#2A9D8F]'}`}
    />
    <label className="absolute left-4 top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#2A9D8F] peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs">
      {label}
    </label>
    {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
  </div>
);

export default function LoginPage() {
  const navigate = useNavigate();
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
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* LEWA STRONA */}
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
            Dołącz do pacjentów, którzy umawiają wizyty online - szybko i bez stresu.
          </p>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <span className="flex items-center gap-2"><span>✓</span> Rezerwacja 24/7 - bez czekania</span>
            <span className="flex items-center gap-2"><span>✓</span> Historia wizyt w jednym miejscu</span>
            <span className="flex items-center gap-2"><span>✓</span> Przypomnienie email przed wizytą</span>
            <span className="flex items-center gap-2"><span>✓</span> Bezpłatne odwołanie wizyty</span>
          </div>
        </div>
        <span className="text-white/40 text-xs">© 2026 MediBook</span>
      </div>

      {/* PRAWA STRONA */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16">
        <div className="flex justify-end mb-8">
          <a href="/" className="text-sm text-gray-400 hover:text-[#2A9D8F] transition">← Wróć do strony głównej</a>
        </div>

        <div className="flex border border-gray-200 rounded-xl p-1 mb-8 max-w-sm">
          <button onClick={() => { setTab('login'); setApiError(''); setErrors({}); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${tab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
            Logowanie
          </button>
          <button onClick={() => { setTab('register'); setApiError(''); setErrors({}); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${tab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
            Rejestracja
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-1">{tab === 'login' ? 'Witaj ponownie!' : 'Zarejestruj się'}</h1>
        <p className="text-sm text-gray-400 mb-8">{tab === 'login' ? 'Zaloguj się, aby zarządzać wizytami' : 'Stwórz nowe konto pacjenta'}</p>

        {apiError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{apiError}</div>
        )}

        <div className="flex flex-col gap-4 max-w-sm">
          {tab === 'register' && (
            <>
              <Field name="first_name" label="Imię" form={form} setForm={setForm} errors={errors} />
              <Field name="last_name" label="Nazwisko" form={form} setForm={setForm} errors={errors} />
            </>
          )}
          <Field name="email" label="Adres email" type="email" form={form} setForm={setForm} errors={errors} />
          <div>
            <Field name="password" label="Hasło" type="password" form={form} setForm={setForm} errors={errors} />
            {tab === 'login' && (
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-[#2A9D8F] hover:underline">Nie pamiętasz hasła?</a>
              </div>
            )}
          </div>
          {tab === 'register' && (
            <Field name="confirmPassword" label="Potwierdź hasło" type="password" form={form} setForm={setForm} errors={errors} />
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-[#2A9D8F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1A7A6E] transition disabled:opacity-50">
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