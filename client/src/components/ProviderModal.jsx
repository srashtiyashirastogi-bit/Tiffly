import { useEffect, useState } from 'react';
import { createSubscription } from '../api.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function ProviderModal({ provider, onClose }) {
  const [plan, setPlan] = useState(provider.plans[provider.plans.length - 1]?.name || '');
  const [form, setForm] = useState({ customerName: '', phone: '', startDate: today() });
  const [state, setState] = useState({ busy: false, msg: '', error: '' });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, msg: '', error: '' });
    try {
      const res = await createSubscription({ providerId: provider._id, planName: plan, ...form });
      setState({ busy: false, msg: res.message, error: '' });
    } catch (err) {
      setState({ busy: false, msg: '', error: err.message });
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={provider.name} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <h3>{provider.name}</h3>
        <p className="muted">
          {provider.area} · {provider.distanceKm} km · {provider.openHours && `Open ${provider.openHours} · `}★ {provider.rating.toFixed(1)} ({provider.reviewCount})
          {provider.verified && ' · Verified'}
        </p>

        {(provider.menu.lunch.length > 0 || provider.menu.dinner.length > 0) && (
          <div className="menus">
            {provider.menu.lunch.length > 0 && <div><b>Lunch</b><p>{provider.menu.lunch.join(', ')}</p></div>}
            {provider.menu.dinner.length > 0 && <div><b>Dinner</b><p>{provider.menu.dinner.join(', ')}</p></div>}
          </div>
        )}

        {provider.reviews.length > 0 && (
          <blockquote>“{provider.reviews[0].text}” <cite>– {provider.reviews[0].author}</cite></blockquote>
        )}

        {state.msg ? (
          <p className="ok">{state.msg}</p>
        ) : (
          <form onSubmit={submit}>
            <fieldset>
              <legend>Choose a plan</legend>
              {provider.plans.map((p) => (
                <label key={p.name} className={'plan' + (plan === p.name ? ' on' : '')}>
                  <input type="radio" name="plan" value={p.name} checked={plan === p.name} onChange={() => setPlan(p.name)} />
                  <span><b>{p.name}</b> · {p.durationDays} days</span>
                  <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                </label>
              ))}
            </fieldset>
            <label>Your name<input className="field" required minLength={2} value={form.customerName} onChange={set('customerName')} autoComplete="name" /></label>
            <label>Mobile number<input className="field" required inputMode="numeric" pattern="[6-9][0-9]{9}" title="10-digit mobile number" value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>
            <label>Start date<input className="field" type="date" required min={today()} value={form.startDate} onChange={set('startDate')} /></label>
            {state.error && <p className="err" role="alert">{state.error}</p>}
            <button className="btn" disabled={state.busy}>{state.busy ? 'Sending…' : 'Request subscription'}</button>
            <p className="muted small">You pay the provider directly. Tiffly doesn’t take payments yet.</p>
          </form>
        )}
      </div>
    </div>
  );
}
