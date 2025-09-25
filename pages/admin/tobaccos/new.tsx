import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

interface TobaccoFormData {
  name: string;
  brand: string;
  blendType: string;
  contents: string;
  cut: string;
  strength: number;
  roomNote: number;
  taste: number;
  observations: string;
  isActive: boolean;
}

export default function NewTobacco() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<TobaccoFormData>({
    name: '',
    brand: '',
    blendType: 'English',
    contents: '',
    cut: 'Ribbon',
    strength: 3,
    roomNote: 5,
    taste: 5,
    observations: '',
    isActive: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/tobaccos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const tobacco = await response.json();
        router.push(`/admin/tobaccos/${tobacco.id}/edit?tab=images`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao criar tabaco');
      }
    } catch (error) {
      console.error('Error creating tobacco:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const getStrengthLabel = (strength: number) => {
    const labels = ['Muito Suave', 'Suave', 'Médio-Suave', 'Médio', 'Médio-Forte', 'Forte', 'Muito Forte'];
    return labels[strength - 1] || 'N/A';
  };

  return (
    <AdminLayout title="Novo Tabaco">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Tabaco</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha as informações do tabaco para adicionar à coleção
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Early Morning Pipe, Nightcap, University Flake"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Marca *
                </label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: Dunhill, Peterson, Mac Baren"
                />
              </div>

              <div>
                <label htmlFor="blendType" className="block text-sm font-medium text-gray-700">
                  Tipo de Blend *
                </label>
                <select
                  name="blendType"
                  id="blendType"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.blendType}
                  onChange={handleInputChange}
                >
                  <option value="English">English</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Virginia/Perique">Virginia/Perique</option>
                  <option value="Aromatic">Aromatic</option>
                  <option value="Burley">Burley</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Latakia">Latakia</option>
                  <option value="Balkan">Balkan</option>
                  <option value="Scottish">Scottish</option>
                  <option value="American">American</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="cut" className="block text-sm font-medium text-gray-700">
                  Corte *
                </label>
                <select
                  name="cut"
                  id="cut"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.cut}
                  onChange={handleInputChange}
                >
                  <option value="Ribbon">Ribbon</option>
                  <option value="Flake">Flake</option>
                  <option value="Plug">Plug</option>
                  <option value="Cake">Cake</option>
                  <option value="Shag">Shag</option>
                  <option value="Granulated">Granulated</option>
                  <option value="Cube Cut">Cube Cut</option>
                  <option value="Coin">Coin</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ativo na coleção</span>
                </label>
              </div>
            </div>
          </div>

          {/* Blend Contents */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Composição do Blend</h3>
            </div>
            <div className="px-6 py-4">
              <label htmlFor="contents" className="block text-sm font-medium text-gray-700">
                Conteúdo *
              </label>
              <textarea
                name="contents"
                id="contents"
                required
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.contents}
                onChange={handleInputChange}
                placeholder="Ex: Virginia 60%, Latakia 30%, Oriental 10%. Inclua percentuais e tipos de tabaco utilizados no blend."
              />
              <p className="mt-1 text-sm text-gray-500">
                Descreva os tipos de tabaco e suas proporções no blend
              </p>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Avaliações</h3>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
                  Força *
                </label>
                <select
                  name="strength"
                  id="strength"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.strength}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(level => (
                    <option key={level} value={level}>
                      {level} - {getStrengthLabel(level)}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  1 = Muito Suave, 7 = Muito Forte
                </p>
              </div>

              <div>
                <label htmlFor="taste" className="block text-sm font-medium text-gray-700">
                  Sabor *
                </label>
                <select
                  name="taste"
                  id="taste"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.taste}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                    <option key={rating} value={rating}>
                      {rating}/10
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Avaliação do sabor de 1 a 10
                </p>
              </div>

              <div>
                <label htmlFor="roomNote" className="block text-sm font-medium text-gray-700">
                  Aroma no Ambiente *
                </label>
                <select
                  name="roomNote"
                  id="roomNote"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.roomNote}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                    <option key={rating} value={rating}>
                      {rating}/10
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Qualidade do aroma no ambiente de 1 a 10
                </p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Observações</h3>
            </div>
            <div className="px-6 py-4">
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
                Observações Adicionais
              </label>
              <textarea
                name="observations"
                id="observations"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Notas de degustação, impressões pessoais, recomendações de harmonização, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/tobaccos')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar Tabaco'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};