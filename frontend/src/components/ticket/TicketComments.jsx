import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import { User, Edit3, Trash2, MessageSquare, Send, X, Check } from 'lucide-react';
import './TicketComments.css';

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

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
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await ticketService.deleteComment(commentId);
        fetchComments();
      } catch (err) {
        setError('Failed to delete comment');
      }
    }
  };

  const isOwner = (comment) => {
    return currentUser && (currentUser.id === comment.user?.id || currentUser.username === comment.user?.username);
  };

  if (loading) return <div className="tc-loading">Loading comments...</div>;

  return (
    <div className="tc-wrapper">
      <h2 className="tc-title">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        Comments ({comments.length})
      </h2>

      {error && <div className="tf-error mb-4">{error}</div>}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="tc-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or technical note..."
          rows="3"
          className="tc-textarea"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="tc-submit-btn"
        >
          {submitting ? 'Posting...' : <><Send className="w-4 h-4 mr-2 inline" /> Post Comment</>}
        </button>
      </form>

      {/* Comments List */}
      <div className="tc-list">
        {comments.length === 0 ? (
          <div className="tc-empty">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="tc-item">
              <div className="tc-item-header">
                <div className="tc-user-info">
                  <div className="tc-avatar">
                    {comment.user?.username?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="tc-username">{comment.user?.username || 'System User'}</div>
                    <div className="tc-date">
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.updatedAt !== comment.createdAt && <span> • edited</span>}
                    </div>
                  </div>
                </div>
                
                {isOwner(comment) && (
                  <div className="tc-actions">
                    <button
                      onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }}
                      className="tc-action-btn edit"
                      title="Edit Comment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="tc-action-btn delete"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editingComment === comment.id ? (
                <div className="tc-edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    className="tc-textarea"
                  />
                  <div className="tc-edit-actions">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="tc-btn-small tc-btn-save"
                    >
                      <Check className="w-3 h-3 mr-1 inline" /> Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="tc-btn-small tc-btn-cancel"
                    >
                      <X className="w-3 h-3 mr-1 inline" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tc-content">{comment.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketComments;
