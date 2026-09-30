import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  MessageSquare,
  Building,
  HeartHandshake,
  KeyRound,
  Send,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Lock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export default function AnonymousReport() {
  const { setHelplineModalOpen } = useSafety();

  // Anonymous Case state
  const [caseCreated, setCaseCreated] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [passphrase, setPassphrase] = useState('');

  // Form State
  const [reportType, setReportType] = useState('Domestic Abuse & Harassment');
  const [urgency, setUrgency] = useState('high');
  const [notes, setNotes] = useState('');

  // Live Counselor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'counselor',
      name: 'Adv. Ananya (Pro-Bono Legal Advocate)',
      text: 'Hello. You are completely anonymous here. No IP address, phone number, or name is stored. How can we support you today with legal guidance, shelter, or safe reporting?',
      time: 'Just now'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateAnonymousCase = (e) => {
    e.preventDefault();
    const randomId = `#SAFE-${Math.floor(1000 + Math.random() * 9000)}-ZK`;
    const randomPass = ['lotus', 'shield', 'aurora', 'courage', 'harbor'][Math.floor(Math.random() * 5)] + '-' + Math.floor(100 + Math.random() * 900);
    setCaseId(randomId);
    setPassphrase(randomPass);
    setCaseCreated(true);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages(prev => [...prev, {
      sender: 'user',
      name: 'Anonymous Citizen',
      text: userText,
      time: 'Now'
    }]);
    setInputMsg('');
    setIsTyping(true);

    // Simulated empathetic legal response
    setTimeout(() => {
      let reply = "We hear you. Under Section 154 CrPC, you have the absolute right to register a 'Zero FIR' at ANY police station irrespective of territorial jurisdiction. Your identity will be masked.";
      if (userText.toLowerCase().includes('stalk') || userText.toLowerCase().includes('follow')) {
        reply = "Stalking is a non-bailable offense under Section 354D IPC / Section 78 BNS. We recommend saving all call records and timestamps in your Blockchain Evidence Vault before sending a cease notice.";
      } else if (userText.toLowerCase().includes('evidence') || userText.toLowerCase().includes('proof')) {
        reply = "Your files uploaded to the Blockchain Vault carry Section 65B electronic attestation certificates. You can grant access directly to our verified legal aid panel from your Vault tab.";
      } else if (userText.toLowerCase().includes('shelter') || userText.toLowerCase().includes('help')) {
        reply = "We have active emergency safe shelters with SNEHA and NCW partners. Please call 181 or 112 directly if you are in immediate physical danger.";
      }

      setChatMessages(prev => [...prev, {
        sender: 'counselor',
        name: 'Adv. Ananya (Pro-Bono Legal Advocate)',
        text: reply,
        time: 'Just now'
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const ngos = [
    {
      name: 'SNEHA (Crisis Intervention Centre)',
      focus: 'Gender-based violence, counseling, medical & legal guidance',
      hotline: '9833052684',
      badge: 'Certified Partner',
      badgeColor: 'badge-purple'
    },
    {
      name: 'Majlis Legal Centre for Women',
      focus: 'Court representation, pro-bono defense, protective orders',
      hotline: '9920241256',
      badge: 'Legal Advocates',
      badgeColor: 'badge-blue'
    },
    {
      name: 'National Commission for Women (NCW)',
      focus: 'All-India statutory body, high-priority inquiries, distress dispatch',
      hotline: '7827170170',
      badge: 'Govt Statutory Body',
      badgeColor: 'badge-green'
    },
    {
      name: 'Prerana Anti-Violence Cell',
      focus: 'Emergency rescue, psychological rehabilitation, youth safety',
      hotline: '9820546820',
      badge: 'Crisis Rescue',
      badgeColor: 'badge-amber'
    }
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span className="badge badge-purple">
            <UserCheck size={12} /> ZERO IDENTITY DISCLOSURE
          </span>
          <span className="badge badge-green">
            END-TO-END CONFIDENTIAL
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '0.75rem' }}>
          Anonymous <span className="text-gradient">Reporting Hub</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '850px' }}>
          Connect with trusted legal advocates, licensed trauma counselors, and verified NGOs without revealing your identity. Zero phone numbers, zero cookies, zero IP tracking.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {/* LEFT COLUMN: Anonymous Case Generation & Legal Counseling Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Case Creator */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <KeyRound size={20} color="#818cf8" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Generate Anonymous Case Docket</h3>
            </div>

            {!caseCreated ? (
              <form onSubmit={generateAnonymousCase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Incident Classification
                  </label>
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="Domestic Abuse & Harassment">Domestic Abuse / Intimidation</option>
                    <option value="Stalking & Cyber Harassment">Stalking & Cyber Harassment</option>
                    <option value="Public Transit Harassment">Public Transit / Workplace Harassment</option>
                    <option value="Blackmail / Non-Consensual Media">Digital Blackmail & Extortion</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Assistance Urgency Level
                  </label>
                  <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                    <option value="high">High - Need Shelter / Police Protection Urgently</option>
                    <option value="medium">Medium - Need Legal Consultation & FIR Guidance</option>
                    <option value="counseling">Counseling - Emotional Support & Recovery</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Anonymous Summary (Do not mention personal names)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe the situation without revealing real names, exact personal addresses, or phone numbers..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Generate Anonymous Dossier
                </button>
              </form>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={20} color="#34d399" />
                  <span style={{ fontWeight: '700', color: '#34d399' }}>Confidential Docket Active</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  Your case is registered on the Zero-Knowledge network. Write down your private passkey to check replies or update evidence anytime:
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#818cf8' }}>CASE ID:</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>{caseId}</span>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#ec4899' }}>PRIVATE RECOVERY PASSKEY:</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>{passphrase}</span>
                </div>
              </div>
            )}
          </div>

          {/* Encrypted Live Counselor & Legal Advocate Chat */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '480px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#818cf8" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Encrypted Legal Aid Consultation</h4>
                  <div style={{ fontSize: '0.75rem', color: '#34d399' }}>● Pro-Bono Counsel Online</div>
                </div>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                <Lock size={10} /> ZERO IP LOGGING
              </span>
            </div>

            {/* Chat Box */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
              {chatMessages.map((msg, idx) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: isMe ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isMe ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '14px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: isMe ? '#a5b4fc' : '#38bdf8', fontWeight: '700', marginBottom: '2px' }}>
                      {msg.name} • {msg.time}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#fff', lineHeight: '1.4' }}>{msg.text}</p>
                  </div>
                );
              })}
              {isTyping && (
                <div style={{ fontSize: '0.78rem', color: '#818cf8', fontStyle: 'italic' }}>
                  Advocate is formulating legal advice...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <input
                type="text"
                placeholder="Ask legal counsel a question anonymously..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Verified Partner NGOs Directory & Legal Rights Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* NGO Directory */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <HeartHandshake size={22} color="#ec4899" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Verified Support NGOs & Helplines</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Confidential counseling, emergency safe houses, and court escorts</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ngos.map((ngo, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{ngo.name}</h4>
                    <span className={`badge ${ngo.badgeColor}`} style={{ fontSize: '0.65rem' }}>{ngo.badge}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ngo.focus}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                      Helpline: {ngo.hotline}
                    </span>
                    <a
                      href={`tel:${ngo.hotline}`}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      <PhoneCall size={12} /> Call Direct
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Victim Legal Rights Quick Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Shield size={20} color="#818cf8" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Your Fundamental Legal Safeguards</h3>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Zero FIR Right:</strong> You can file a Zero FIR at any police station regardless of where the incident occurred.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Female Police Officer:</strong> By law, statements involving harassment must be recorded by a female police personnel.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Digital Evidence Admissibility:</strong> Blockchain-certified audio/video recordings can be introduced under Section 65B without alteration doubts.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Identity Protection:</strong> Section 228A IPC mandates complete anonymity; your name or image can never be published publicly without consent.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
