import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  itemId: string;
  itemType: 'pipe' | 'tobacco' | 'accessory';
  existingImages?: Array<{
    id: string;
    filename: string;
    originalName: string;
    url?: string;
    sortOrder: number;
  }>;
  onUploadComplete?: (images: any[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
}

export default function ImageUpload({
  itemId,
  itemType,
  existingImages = [],
  onUploadComplete,
  onUploadError,
  maxFiles = 10
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState(existingImages);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('itemId', itemId);
      formData.append('itemType', itemType);
      
      acceptedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      const response = await new Promise<Response>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(new Response(xhr.response, {
              status: xhr.status,
              statusText: xhr.statusText,
            }));
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', '/api/admin/upload-images');
        xhr.send(formData);
      });

      const result = await response.json();

      if (response.ok) {
        const newImages = [...images, ...result.images];
        setImages(newImages);
        onUploadComplete?.(result.images);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [itemId, itemType, images, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: uploading || images.length >= maxFiles
  });

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
      } else {
        const error = await response.json();
        onUploadError?.(error.message || 'Erro ao excluir imagem');
      }
    } catch (error) {
      console.error('Delete error:', error);
      onUploadError?.('Erro ao excluir imagem');
    }
  };

  const handleReorderImages = async (dragIndex: number, dropIndex: number) => {
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    // Update sort orders
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      sortOrder: index + 1
    }));

    setImages(updatedImages);

    // Update in database
    try {
      await Promise.all(
        updatedImages.map((img, index) =>
          fetch(`/api/admin/images/${img.id}/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sortOrder: index + 1 })
          })
        )
      );
    } catch (error) {
      console.error('Reorder error:', error);
      onUploadError?.('Erro ao reordenar imagens');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : uploading || images.length >= maxFiles
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 text-indigo-500">
              <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Enviando imagens...</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        ) : images.length >= maxFiles ? (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">📸</div>
            <p className="text-sm text-gray-500">Limite máximo de {maxFiles} imagens atingido</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">📸</div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Solte as imagens aqui...'
                : 'Arraste imagens ou clique para selecionar'
              }
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPEG, PNG, WebP - Máximo 5MB por imagem
            </p>
            <p className="text-xs text-gray-500">
              {images.length}/{maxFiles} imagens
            </p>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Imagens ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group border rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={image.url || `/uploads/${image.filename}`}
                  alt={image.originalName}
                  className="w-full h-32 object-cover"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Excluir imagem"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sort order indicator */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            As imagens são exibidas na ordem que aparecerão no site. A primeira imagem será a imagem principal.
          </p>
        </div>
      )}
    </div>
  );
}