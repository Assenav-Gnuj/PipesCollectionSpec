import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';

interface AccessoryFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  observations: string;
  isActive: boolean;
}

export default function NewAccessory() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<AccessoryFormData>({
    name: '',
    brand: '',
    category: 'Limpeza',
    description: '',
    observations: '',
    isActive: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/accessories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const accessory = await response.json();
        router.push(`/admin/accessories/${accessory.id}/edit?tab=images`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao criar acessório');
      }
    } catch (error) {
      console.error('Error creating accessory:', error);
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
    <AdminLayout title="Novo Acessório">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Acessório</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha as informações do acessório para adicionar à coleção
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Escova de Limpeza, Isqueiro Peterson, Suporte para Cachimbo"
                />
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
                  placeholder="Ex: Peterson, Savinelli, BJ Long"
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
                  <option value="Isqueiro">Isqueiro</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Ferramenta">Ferramenta</option>
                  <option value="Armazenamento">Armazenamento</option>
                  <option value="Filtro">Filtro</option>
                  <option value="Estojo">Estojo</option>
                  <option value="Tamper">Tamper</option>
                  <option value="Cenicero">Cenicero</option>
                  <option value="Umidificador">Umidificador</option>
                  <option value="Higrômetro">Higrômetro</option>
                  <option value="Bolsa">Bolsa de Tabaco</option>
                  <option value="Other">Outro</option>
                </select>
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
                Descrição *
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o acessório, suas características principais, finalidade e especificações técnicas."
              />
              <p className="mt-1 text-sm text-gray-500">
                Inclua informações sobre material, dimensões, compatibilidade e uso
              </p>
            </div>
          </div>

          {/* Category-Specific Fields */}
          {formData.category === 'Limpeza' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Informações de Limpeza</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Para itens de limpeza, considere incluir na descrição:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                  <li>Tipo de material (cerdas naturais, sintéticas, algodão, etc.)</li>
                  <li>Comprimento e espessura (para limpadores de haste)</li>
                  <li>Compatibilidade com tipos de cachimbo</li>
                  <li>Instruções de uso recomendadas</li>
                </ul>
              </div>
            </div>
          )}

          {formData.category === 'Isqueiro' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Informações do Isqueiro</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Para isqueiros, considere incluir na descrição:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                  <li>Tipo de combustível (butano, gasolina, etc.)</li>
                  <li>Tipo de chama (suave, dirigida, etc.)</li>
                  <li>Material do corpo (metal, plástico, etc.)</li>
                  <li>Características especiais (à prova de vento, recarregável, etc.)</li>
                </ul>
              </div>
            </div>
          )}

          {formData.category === 'Armazenamento' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Informações de Armazenamento</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">
                  Para itens de armazenamento, considere incluir na descrição:
                </p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                  <li>Capacidade (quantidade de cachimbos, gramas de tabaco, etc.)</li>
                  <li>Material e acabamento</li>
                  <li>Dimensões internas e externas</li>
                  <li>Sistema de vedação (se aplicável)</li>
                  <li>Divisórias ou compartimentos</li>
                </ul>
              </div>
            </div>
          )}

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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                value={formData.observations}
                onChange={handleInputChange}
                placeholder="Notas pessoais, experiência de uso, recomendações, histórico de aquisição, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/accessories')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar Acessório'}
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