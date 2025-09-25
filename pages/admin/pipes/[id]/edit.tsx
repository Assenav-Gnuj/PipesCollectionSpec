import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { prisma } from '@/lib/prisma';

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

interface EditPipeProps {
  pipe: any;
  images: any[];
}

export default function EditPipe({ pipe, images }: EditPipeProps) {
  const router = useRouter();
  const { tab = 'details' } = router.query;
  const [activeTab, setActiveTab] = useState(tab as string);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PipeFormData>({
    name: pipe.name,
    brand: pipe.brand,
    model: pipe.model || '',
    material: pipe.material,
    shape: pipe.shape,
    finish: pipe.finish,
    filterType: pipe.filterType,
    stemMaterial: pipe.stemMaterial,
    year: pipe.year ? pipe.year.toString() : '',
    country: pipe.country || '',
    observations: pipe.observations || '',
    isActive: pipe.isActive,
  });

  useEffect(() => {
    setActiveTab(tab as string);
  }, [tab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/pipes/${pipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year: formData.year ? parseInt(formData.year) : null,
        }),
      });

      if (response.ok) {
        alert('Cachimbo atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao atualizar cachimbo');
      }
    } catch (error) {
      console.error('Error updating pipe:', error);
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
    router.push(`/admin/pipes/${pipe.id}/edit?tab=${newTab}`, undefined, { shallow: true });
  };

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: '📝' },
    { id: 'images', label: 'Imagens', icon: '🖼️' },
  ];

  return (
    <AdminLayout title={`Editar: ${pipe.name}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Cachimbo</h1>
              <p className="mt-2 text-sm text-gray-600">{pipe.name}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/pipes')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Voltar à Lista
              </button>
              <a
                href={`/cachimbos/${pipe.id}`}
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
                    ? 'border-blue-500 text-blue-600'
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.brand}
                    onChange={handleInputChange}
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.model}
                    onChange={handleInputChange}
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.year}
                    onChange={handleInputChange}
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.observations}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/pipes')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
                Adicione, reordene ou remova imagens do cachimbo
              </p>
            </div>
            <div className="p-6">
              <ImageUpload
                itemType="pipe"
                itemId={pipe.id}
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
    const pipe = await prisma.pipe.findUnique({
      where: { id: id as string },
    });

    if (!pipe) {
      return {
        notFound: true,
      };
    }

    const images = await prisma.image.findMany({
      where: {
        itemType: 'pipe',
        itemId: id as string,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const serializedPipe = {
      ...pipe,
      createdAt: pipe.createdAt.toISOString(),
      updatedAt: pipe.updatedAt.toISOString(),
    };

    const serializedImages = images.map(image => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return {
      props: {
        pipe: serializedPipe,
        images: serializedImages,
      },
    };
  } catch (error) {
    console.error('Error fetching pipe:', error);
    return {
      notFound: true,
    };
  }
};