import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { prisma } from '@/lib/prisma';

interface TobaccoFormData {
  name: string;
  brand: string;
  type: string;
  cut: string;
  strength: string;
  room_note: string;
  taste_notes: string;
  description: string;
  isActive: boolean;
}

interface EditTobaccoProps {
  tobacco: any;
  images: any[];
}

export default function EditTobacco({ tobacco, images }: EditTobaccoProps) {
  const router = useRouter();
  const { tab = 'details' } = router.query;
  const [activeTab, setActiveTab] = useState(tab as string);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<TobaccoFormData>({
    name: tobacco.name,
    brand: tobacco.brand,
    type: tobacco.type,
    cut: tobacco.cut,
    strength: tobacco.strength,
    room_note: tobacco.room_note || '',
    taste_notes: tobacco.taste_notes || '',
    description: tobacco.description || '',
    isActive: tobacco.isActive,
  });

  useEffect(() => {
    setActiveTab(tab as string);
  }, [tab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/tobaccos/${tobacco.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Tabaco atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao atualizar tabaco');
      }
    } catch (error) {
      console.error('Error updating tobacco:', error);
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

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/admin/tobaccos/${tobacco.id}/edit?tab=${newTab}`, undefined, { shallow: true });
  };

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: '📝' },
    { id: 'images', label: 'Imagens', icon: '🖼️' },
  ];

  return (
    <AdminLayout title={`Editar: ${tobacco.name}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Tabaco</h1>
              <p className="mt-2 text-sm text-gray-600">{tobacco.name}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/tobaccos')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Voltar à Lista
              </button>
              <a
                href={`/tabacos/${tobacco.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Ver no Site
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => handleTabChange(tabItem.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tabItem.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tabItem.icon}</span>
                {tabItem.label}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'details' && (
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
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipo *
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="Aromático">Aromático</option>
                    <option value="English">English</option>
                    <option value="Virginia">Virginia</option>
                    <option value="Burley">Burley</option>
                    <option value="Oriental">Oriental</option>
                    <option value="Latakia">Latakia</option>
                    <option value="Blend">Blend</option>
                    <option value="Outros">Outros</option>
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
                    <option value="Cube">Cube</option>
                    <option value="Navy">Navy</option>
                    <option value="Shag">Shag</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

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
                    <option value="Suave">Suave</option>
                    <option value="Meio-Suave">Meio-Suave</option>
                    <option value="Médio">Médio</option>
                    <option value="Meio-Forte">Meio-Forte</option>
                    <option value="Forte">Forte</option>
                    <option value="Muito Forte">Muito Forte</option>
                  </select>
                </div>

                <div>
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

            {/* Flavor Profile */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Perfil de Sabor</h3>
              </div>
              <div className="px-6 py-4 space-y-6">
                <div>
                  <label htmlFor="room_note" className="block text-sm font-medium text-gray-700">
                    Aroma no Ambiente
                  </label>
                  <input
                    type="text"
                    name="room_note"
                    id="room_note"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={formData.room_note}
                    onChange={handleInputChange}
                    placeholder="Descreva o aroma que exala no ambiente"
                  />
                </div>

                <div>
                  <label htmlFor="taste_notes" className="block text-sm font-medium text-gray-700">
                    Notas de Sabor
                  </label>
                  <textarea
                    name="taste_notes"
                    id="taste_notes"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={formData.taste_notes}
                    onChange={handleInputChange}
                    placeholder="Descreva as notas de sabor percebidas durante o fumo"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição Geral
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição completa do tabaco, impressões gerais, características especiais"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/tobaccos')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'images' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Gerenciar Imagens</h3>
              <p className="mt-1 text-sm text-gray-600">
                Adicione, reordene ou remova imagens do tabaco
              </p>
            </div>
            <div className="p-6">
              <ImageUpload
                itemType="tobacco"
                itemId={tobacco.id}
                existingImages={images}
                maxFiles={10}
                onUploadComplete={() => {
                  // Refresh images
                  router.reload();
                }}
              />
            </div>
          </div>
        )}
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

  const { id } = context.params!;

  try {
    const tobacco = await prisma.tobacco.findUnique({
      where: { id: id as string },
    });

    if (!tobacco) {
      return {
        notFound: true,
      };
    }

    const images = await prisma.image.findMany({
      where: {
        itemType: 'tobacco',
        itemId: id as string,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const serializedTobacco = {
      ...tobacco,
      createdAt: tobacco.createdAt.toISOString(),
      updatedAt: tobacco.updatedAt.toISOString(),
    };

    const serializedImages = images.map(image => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return {
      props: {
        tobacco: serializedTobacco,
        images: serializedImages,
      },
    };
  } catch (error) {
    console.error('Error fetching tobacco:', error);
    return {
      notFound: true,
    };
  }
};