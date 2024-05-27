import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [recipient, setRecipient] = useState('imad.saleem@hotmail.fr');
  const [subject, setSubject] = useState('subjtest');
  const [message, setMessage] = useState('msgtest');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/send_email', {
        recipient,
        subject,
        message,
      });
      console.log(res);
      setResponse(res.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError('Une erreur interne du serveur est survenue.');
      } else {
        setError(`Erreur : ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h1>Envoyer un Email</h1>
      <p>Connecté en tant que projetrustsender@outlook.com</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destinataire:</label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sujet:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      {response && <p>{response}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default App;
