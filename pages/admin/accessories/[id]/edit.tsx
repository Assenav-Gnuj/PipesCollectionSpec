import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { prisma } from '@/lib/prisma';

interface AccessoryFormData {
  name: string;
  category: string;
  brand: string;
  description: string;
  isActive: boolean;
}

interface EditAccessoryProps {
  accessory: any;
  images: any[];
}

export default function EditAccessory({ accessory, images }: EditAccessoryProps) {
  const router = useRouter();
  const { tab = 'details' } = router.query;
  const [activeTab, setActiveTab] = useState(tab as string);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setAccessoryFormData] = useState<AccessoryFormData>({
    name: accessory.name,
    category: accessory.category,
    brand: accessory.brand || '',
    description: accessory.description || '',
    isActive: accessory.isActive,
  });

  useEffect(() => {
    setActiveTab(tab as string);
  }, [tab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/accessories/${accessory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Acessório atualizado com sucesso!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao atualizar acessório');
      }
    } catch (error) {
      console.error('Error updating accessory:', error);
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setAccessoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.push(`/admin/accessories/${accessory.id}/edit?tab=${newTab}`, undefined, { shallow: true });
  };

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: '📝' },
    { id: 'images', label: 'Imagens', icon: '🖼️' },
  ];

  return (
    <AdminLayout title={`Editar: ${accessory.name}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Acessório</h1>
              <p className="mt-2 text-sm text-gray-600">{accessory.name}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/accessories')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Voltar à Lista
              </button>
              <a
                href={`/acessorios/${accessory.id}`}
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
                    ? 'border-purple-500 text-purple-600'
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoria *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Limpeza">Limpeza</option>
                    <option value="Armazenamento">Armazenamento</option>
                    <option value="Ferramenta">Ferramenta</option>
                    <option value="Filtro">Filtro</option>
                    <option value="Piteira">Piteira</option>
                    <option value="Decorativo">Decorativo</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Ex: Peterson, Savinelli, Dunhill"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ativo na coleção</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Descrição</h3>
              </div>
              <div className="px-6 py-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição do Acessório
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o acessório, suas características, utilidade e outras informações relevantes"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/accessories')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
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
                Adicione, reordene ou remova imagens do acessório
              </p>
            </div>
            <div className="p-6">
              <ImageUpload
                itemType="accessory"
                itemId={accessory.id}
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
    const accessory = await prisma.accessory.findUnique({
      where: { id: id as string },
    });

    if (!accessory) {
      return {
        notFound: true,
      };
    }

    const images = await prisma.image.findMany({
      where: {
        itemType: 'accessory',
        itemId: id as string,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const serializedAccessory = {
      ...accessory,
      createdAt: accessory.createdAt.toISOString(),
      updatedAt: accessory.updatedAt.toISOString(),
    };

    const serializedImages = images.map(image => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    }));

    return {
      props: {
        accessory: serializedAccessory,
        images: serializedImages,
      },
    };
  } catch (error) {
    console.error('Error fetching accessory:', error);
    return {
      notFound: true,
    };
  }
};