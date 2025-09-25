import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  itemType: 'pipe' | 'tobacco' | 'accessory';
  itemId: string;
  className?: string;
}

export default function CommentSection({ itemType, itemId, className = '' }: CommentSectionProps) {
  const session = null; // Temporariamente desabilitado para SSG
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [itemType, itemId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/${itemType}/${itemId}/comments`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Erro ao carregar comentários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setError('Você precisa estar logado para comentar');
      return;
    }

    if (!newComment.trim()) {
      setError('O comentário não pode estar vazio');
      return;
    }

    if (newComment.length > 1000) {
      setError('O comentário deve ter no máximo 1000 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/${itemType}/${itemId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar comentário');
      }

      const data = await response.json();
      
      // Add new comment to the list
      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error instanceof Error ? error.message : 'Erro ao enviar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getUserAvatar = (user: Comment['user']) => {
    if (user.image) {
      return (
        <img
          src={user.image}
          alt={user.name || 'Usuário'}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {(user.name || 'U').charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="comment" className="sr-only">
              Seu comentário
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 resize-none"
              placeholder="Escreva seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Máximo 1000 caracteres</span>
              <span>{newComment.length}/1000</span>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </span>
              ) : (
                'Comentar'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-600 mb-2">
            Você precisa estar logado para comentar
          </p>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Fazer login
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Ainda não há comentários.</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {getUserAvatar(comment.user)}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.user.name || 'Usuário'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More (if needed in the future) */}
      {comments.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Mostrando {comments.length} comentário{comments.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}