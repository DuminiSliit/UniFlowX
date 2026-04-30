import React, { useState } from 'react';
import ticketService from '../../services/ticketService';
import { Upload, X, FileText, ImageIcon, Loader2 } from 'lucide-react';
import './AttachmentUpload.css';

const AttachmentUpload = ({ ticketId, attachments = [], onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (attachments.length >= 3) {
      setError('Maximum 3 attachments allowed per ticket');
      return;
    }

    try {
      setUploading(true);
      setError('');
      await ticketService.uploadAttachment(ticketId, file);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        await ticketService.deleteAttachment(id);
        if (onUpdate) onUpdate();
      } catch (err) {
        setError('Failed to delete attachment');
      }
    }
  };

  return (
    <div className="au-wrapper">
      <div className="au-header">
        <h2><ImageIcon className="w-5 h-5 text-indigo-600" /> Evidence & Attachments ({attachments.length}/3)</h2>
        {attachments.length < 3 && (
          <div className="au-upload-btn-wrapper">
            <input
              type="file"
              id="au-file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*"
              className="au-file-input"
            />
            <label htmlFor="au-file" className={`au-btn ${uploading ? 'disabled' : ''}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Add Evidence'}
            </label>
          </div>
        )}
      </div>

      {error && <div className="tf-error mb-4">{error}</div>}

      <div className="au-grid">
        {attachments.map((att) => (
          <div key={att.id} className="au-item">
            <div className="au-preview">
              {/* In a real app, you'd show the actual image. 
                  Since we store as BLOB, we use the download endpoint as src if we want previews */}
              <div className="au-placeholder">
                <FileText className="w-8 h-8 text-indigo-200" />
              </div>
              <button onClick={() => handleDelete(att.id)} className="au-delete">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="au-info">
              <span className="au-name">{att.fileName}</span>
              <span className="au-size">{(att.fileSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        ))}
        
        {attachments.length === 0 && (
          <div className="au-empty">
            <div className="au-empty-icon"><ImageIcon className="w-8 h-8" /></div>
            <p>No visual evidence attached to this ticket yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentUpload;
