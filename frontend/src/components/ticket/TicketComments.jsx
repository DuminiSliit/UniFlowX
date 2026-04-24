import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketComments(ticketId);
      setComments(data);
    } catch (err) {
      setError('Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await ticketService.addComment(ticketId, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await ticketService.updateComment(commentId, { content: editContent });
      setEditingComment(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      setError('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await ticketService.deleteComment(commentId);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex space-x-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="2"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{comment.user?.username || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.updatedAt !== comment.createdAt && (
                      <span className="ml-2">(edited)</span>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(comment)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketComments;
