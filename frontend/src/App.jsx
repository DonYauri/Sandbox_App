import { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration Failed');
    }
  };

  return (
    <div className="void-container">
      <div className="void-panel">
        <h1 className="void-title">REGISTER</h1>
        <form onSubmit={handleRegister}>
          <input
            className="void-input"
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="void-input"
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="void-button" type="submit">CREATE ACCOUNT</button>
        </form>
        {error && <p className="void-error">{error}</p>}
      </div>
    </div>
  );
}

function Chat({ token }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMsg = message;
    setHistory((h) => [...h, { role: 'user', text: userMsg }]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory((h) => [...h, { role: 'assistant', text: response.data.reply }]);
    } catch (err) {
      setHistory((h) => [...h, { role: 'assistant', text: 'Error getting response' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="void-glass-panel">
      <div className="void-chat-log">
        {history.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'void-msg-user' : 'void-msg-assistant'}>
            <strong>{m.role === 'user' ? 'YOU' : 'AI'}:</strong> {m.text}
          </p>
        ))}
      </div>
      {isTyping && <p className="void-typing">AI is thinking...</p>}
      <form className="void-chat-form" onSubmit={sendMessage}>
        <input
          className="void-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="TYPE A MESSAGE..."
        />
        <button className="void-button" type="submit">SEND</button>
      </form>
    </div>
  );
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (token) {
    return (
      <div className="void-app-shell">
        <header className="void-header">
          <span className="void-brand">VOID.OS // TERMINAL</span>
          <button className="void-logout-btn" onClick={handleLogout}>LOG OUT</button>
        </header>
        <div className="void-chat-stage">
          <Chat token={token} />
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div>
        <RegisterForm onSuccess={() => setShowRegister(false)} />
        <div className="void-container" style={{ marginTop: '-40px' }}>
          <button className="void-link" onClick={() => setShowRegister(false)}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="void-container">
      <div className="void-panel">
        <h1 className="void-title">LOG IN</h1>
        <form onSubmit={handleLogin}>
          <input
            className="void-input"
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="void-input"
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="void-button" type="submit">ENTER</button>
        </form>
        {error && <p className="void-error">{error}</p>}
        <button className="void-link" onClick={() => setShowRegister(true)}>
          Need an account? Register
        </button>
      </div>
    </div>
  );
}

export default App;
