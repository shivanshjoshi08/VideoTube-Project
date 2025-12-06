import React, { useState, useEffect } from 'react';
import commentService from '../services/comment.service';

function CommentSection({ videoId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await commentService.getVideoComments(videoId);
            setComments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            // Comment API not yet implemented
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            await commentService.addComment(videoId, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment (Backend not implemented yet)');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--yt-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>
                {comments.length} Comments
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows="2"
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            backgroundColor: 'var(--yt-hover)',
                            border: '1px solid var(--yt-border)',
                            borderRadius: '6px',
                            color: 'var(--yt-text-primary)',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        style={{
                            padding: '0.8rem 1.5rem',
                            backgroundColor: 'var(--yt-brand-color)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            opacity: submitting || !newComment.trim() ? 0.6 : 1
                        }}
                    >
                        {submitting ? 'Posting...' : 'Comment'}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {loading ? (
                    <p style={{ color: 'var(--yt-text-secondary)' }}>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p style={{ color: 'var(--yt-text-secondary)' }}>
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment._id}
                            style={{
                                display: 'flex',
                                gap: '0.75rem',
                                marginBottom: '1.5rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid var(--yt-border)'
                            }}
                        >
                            <img
                                src={comment.owner?.avatar || 'https://via.placeholder.com/32'}
                                alt={comment.owner?.username}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    flexShrink: 0
                                }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'baseline',
                                    marginBottom: '0.3rem'
                                }}>
                                    <strong style={{ color: 'var(--yt-text-primary)', fontSize: '0.9rem' }}>
                                        {comment.owner?.username}
                                    </strong>
                                    <span style={{ color: 'var(--yt-text-secondary)', fontSize: '0.8rem' }}>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    color: 'var(--yt-text-primary)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    wordBreak: 'break-word'
                                }}>
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;
