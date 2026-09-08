import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactAdmin({ activePersona }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: activePersona?.name || '',
    email: activePersona?.email || '',
    query: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Mock API call to send to admin
    setTimeout(() => {
      setFormData({ ...formData, query: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{t('contact_admin')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Submit your queries, suggestions, or issues directly to the MoSPI Admin team.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>Query Submitted Successfully!</h3>
            <p style={{ color: 'var(--text-main)', marginTop: '8px' }}>Thank you. The admin team will review your message and respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                <User size={16} color="var(--navy-primary)" /> Full Name
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                <Mail size={16} color="var(--navy-primary)" /> Official Email Address
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                <MessageSquare size={16} color="var(--navy-primary)" /> Your Query or Suggestion
              </label>
              <textarea 
                value={formData.query}
                onChange={e => setFormData({...formData, query: e.target.value})}
                required
                rows={5}
                placeholder="Please describe your issue or suggestion..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '1rem' }}>
              <Send size={18} /> Send Message to Admin
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
