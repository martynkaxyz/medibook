import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center text-center px-8">
      <div className="w-20 h-20 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="text-6xl font-bold text-[#2A9D8F] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Strona nie istnieje</h2>
      <p className="text-gray-400 text-sm mb-8">
        Strona której szukasz została przeniesiona lub nie istnieje.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-full text-sm font-medium hover:border-[#2A9D8F] hover:text-[#2A9D8F] transition"
        >
          Wróć
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-[#2A9D8F] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1A7A6E] transition"
        >
          Strona główna
        </button>
      </div>
    </div>
  );
}