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
    <form onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

function Chat({ token }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMsg = message;
    setHistory((h) => [...h, { role: 'user', text: userMsg }]);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory((h) => [...h, { role: 'assistant', text: response.data.reply }]);
    } catch (err) {
      setHistory((h) => [...h, { role: 'assistant', text: 'Error getting response' }]);
    }
  };

  return (
    <div>
      <div>
        {history.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
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
      <div>
        <h1>You're logged in</h1>
        <p>Token: {token.slice(0, 20)}...</p>
        <button onClick={handleLogout}>Log Out</button>
        <Chat token={token} />
      </div>
    );
  }

  if (showRegister) {
    return (
      <div>
        <h1>Register</h1>
        <RegisterForm onSuccess={() => setShowRegister(false)} />
        <button onClick={() => setShowRegister(false)}>Back to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setShowRegister(true)}>Need an account? Register</button>
    </div>
  );
}

export default App;
