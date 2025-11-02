'use client';

import { useState } from 'react';

interface RucData {
  ruc: string;
  razonSocial: string;
  estado: string;
  condicion: string;
  direccion: string;
  ubigeo: string;
  tipoContribuyente: string;
  fechaInscripcion: string;
}

export default function Home() {
  const [ruc, setRuc] = useState('');
  const [data, setData] = useState<RucData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ruc.length !== 11) {
      setError('El RUC debe tener 11 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`/api/ruc?numero=${ruc}`);
      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError('Error al consultar el RUC. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setRuc(value);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Consulta RUC - SUNAT
            </h1>
            <p className="text-gray-600">
              Busca información de empresas registradas en Perú
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de RUC
                </label>
                <input
                  type="text"
                  id="ruc"
                  value={ruc}
                  onChange={handleRucChange}
                  placeholder="Ingrese 11 dígitos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
                  maxLength={11}
                />
              </div>
              <div className="sm:self-end">
                <button
                  type="submit"
                  disabled={loading || ruc.length !== 11}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}

          {data && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Información del Contribuyente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">RUC</p>
                  <p className="text-lg font-semibold text-gray-800">{data.ruc}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Razón Social</p>
                  <p className="text-lg font-semibold text-gray-800">{data.razonSocial}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <p className={`text-lg font-semibold ${
                    data.estado === 'ACTIVO' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.estado}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Condición</p>
                  <p className={`text-lg font-semibold ${
                    data.condicion === 'HABIDO' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {data.condicion}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Dirección Fiscal</p>
                  <p className="text-lg font-semibold text-gray-800">{data.direccion}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Contribuyente</p>
                  <p className="text-lg font-semibold text-gray-800">{data.tipoContribuyente}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Fecha de Inscripción</p>
                  <p className="text-lg font-semibold text-gray-800">{data.fechaInscripcion}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Nota:</strong> Esta aplicación utiliza una API pública para consultar información de SUNAT.
              Los datos mostrados son de carácter informativo.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
