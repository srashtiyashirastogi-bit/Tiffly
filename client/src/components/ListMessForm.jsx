import { useState } from 'react';
import { listMess } from '../api.js';

const empty = { name: '', area: '', address: '', phone: '', type: 'veg', meals: 'both', monthlyPrice: '', description: '' };

export default function ListMessForm() {
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ busy: false, msg: '', error: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, msg: '', error: '' });
    try {
      const res = await listMess({ ...form, monthlyPrice: Number(form.monthlyPrice) });
      setState({ busy: false, msg: res.message, error: '' });
      setForm(empty);
    } catch (err) {
      setState({ busy: false, msg: '', error: err.message });
    }
  }

  return (
    <form className="card-form" onSubmit={submit}>
      <label>Mess or tiffin name<input className="field" required value={form.name} onChange={set('name')} /></label>
      <label>Area<input className="field" required value={form.area} onChange={set('area')} placeholder="e.g. Hostel Road" /></label>
      <label>Address (optional)<input className="field" value={form.address} onChange={set('address')} /></label>
      <label>Mobile number<input className="field" required inputMode="numeric" pattern="[6-9][0-9]{9}" title="10-digit mobile number" value={form.phone} onChange={set('phone')} /></label>
      <div className="row">
        <label>Food<select className="field" value={form.type} onChange={set('type')}><option value="veg">Veg</option><option value="nonveg">Non-veg</option><option value="both">Veg + Non-veg</option></select></label>
        <label>Meals<select className="field" value={form.meals} onChange={set('meals')}><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="both">Lunch + Dinner</option></select></label>
      </div>
      <label>Monthly price (₹)<input className="field" type="number" required min="0" max="50000" value={form.monthlyPrice} onChange={set('monthlyPrice')} /></label>
      <label>About your mess (optional)<textarea className="field" rows="2" maxLength="500" value={form.description} onChange={set('description')} /></label>
      {state.msg && <p className="ok" role="status">{state.msg}</p>}
      {state.error && <p className="err" role="alert">{state.error}</p>}
      <button className="btn" disabled={state.busy}>{state.busy ? 'Sending…' : 'List my mess'}</button>
    </form>
  );
}
