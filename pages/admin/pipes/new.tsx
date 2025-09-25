import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

interface PipeFormData {
  name: string;
  brand: string;
  model: string;
  material: string;
  shape: string;
  finish: string;
  filterType: string;
  stemMaterial: string;
  year: string;
  country: string;
  observations: string;
  isActive: boolean;
}

export default function NewPipe() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PipeFormData>({
    name: '',
    brand: '',
    model: '',
    material: 'Briar',
    shape: 'Billiard',
    finish: 'Natural',
    filterType: '9mm',
    stemMaterial: 'Vulcanite',
    year: '',
    country: '',
    observations: '',
    isActive: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/pipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year: formData.year ? parseInt(formData.year) : null,
        }),
      });

      if (response.ok) {
        const pipe = await response.json();
        router.push(`/admin/pipes/${pipe.id}/edit?tab=images`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao criar cachimbo');
      }
    } catch (error) {
      console.error('Error creating pipe:', error);
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AdminLayout title="Novo Cachimbo">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Cachimbo</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha as informações do cachimbo para adicionar à coleção
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Cachimbo Italiano Clássico"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: Savinelli, Peterson, Dunhill"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Modelo
                </label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Ex: Trevi, Sherlock Holmes, Royal Irish"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Ano
                </label>
                <input
                  type="number"
                  name="year"
                  id="year"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Ex: 2023"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  País de Origem
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Ex: Itália, Inglaterra, Dinamarca"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ativo na coleção</span>
                </label>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalhes Técnicos</h3>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                  Material *
                </label>
                <select
                  name="material"
                  id="material"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.material}
                  onChange={handleInputChange}
                >
                  <option value="Briar">Briar</option>
                  <option value="Meerschaum">Espuma do Mar</option>
                  <option value="Corncob">Sabugo de Milho</option>
                  <option value="Clay">Argila</option>
                  <option value="Cherry">Cereja</option>
                  <option value="Pear">Pera</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="shape" className="block text-sm font-medium text-gray-700">
                  Formato *
                </label>
                <select
                  name="shape"
                  id="shape"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.shape}
                  onChange={handleInputChange}
                >
                  <option value="Billiard">Billiard</option>
                  <option value="Apple">Apple</option>
                  <option value="Bent">Bent</option>
                  <option value="Dublin">Dublin</option>
                  <option value="Bulldog">Bulldog</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Churchwarden">Churchwarden</option>
                  <option value="Poker">Poker</option>
                  <option value="Prince">Prince</option>
                  <option value="Rhodesian">Rhodesian</option>
                  <option value="Volcano">Volcano</option>
                  <option value="Freehand">Freehand</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="finish" className="block text-sm font-medium text-gray-700">
                  Acabamento *
                </label>
                <select
                  name="finish"
                  id="finish"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.finish}
                  onChange={handleInputChange}
                >
                  <option value="Natural">Natural</option>
                  <option value="Smooth">Liso</option>
                  <option value="Sandblast">Sandblast</option>
                  <option value="Rusticated">Rusticated</option>
                  <option value="Carved">Entalhado</option>
                  <option value="Stained">Tingido</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">
                  Tipo de Filtro *
                </label>
                <select
                  name="filterType"
                  id="filterType"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.filterType}
                  onChange={handleInputChange}
                >
                  <option value="9mm">9mm</option>
                  <option value="6mm">6mm</option>
                  <option value="None">Sem Filtro</option>
                  <option value="Balsa">Balsa</option>
                  <option value="Metal">Metal</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="stemMaterial" className="block text-sm font-medium text-gray-700">
                  Material da Piteira *
                </label>
                <select
                  name="stemMaterial"
                  id="stemMaterial"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.stemMaterial}
                  onChange={handleInputChange}
                >
                  <option value="Vulcanite">Vulcanite</option>
                  <option value="Acrylic">Acrílico</option>
                  <option value="Cumberland">Cumberland</option>
                  <option value="Amber">Âmbar</option>
                  <option value="Horn">Chifre</option>
                  <option value="Other">Outro</option>
                </select>
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Informações adicionais sobre o cachimbo, como história, características especiais, condições, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/pipes')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar Cachimbo'}
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