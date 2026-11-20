import { useState } from 'react';
import { joinWaitlist } from '../api.js';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [state, setState] = useState({ busy: false, msg: '', error: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, msg: '', error: '' });
    try {
      const res = await joinWaitlist({ email, role });
      setState({ busy: false, msg: res.message, error: '' });
      setEmail('');
    } catch (err) {
      setState({ busy: false, msg: '', error: err.message });
    }
  }

  return (
    <form className="inline" onSubmit={submit}>
      <input className="field" type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
      <select className="field" value={role} onChange={(e) => setRole(e.target.value)} aria-label="I am a">
        <option value="customer">I want meals</option>
        <option value="provider">I run a mess</option>
      </select>
      <button className="btn" disabled={state.busy}>{state.busy ? 'Joining…' : 'Join early access'}</button>
      {state.msg && <p className="ok" role="status">{state.msg}</p>}
      {state.error && <p className="err" role="alert">{state.error}</p>}
    </form>
  );
}
