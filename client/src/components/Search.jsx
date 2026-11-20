import { useEffect, useState } from 'react';
import { getProviders } from '../api.js';
import ProviderCard from './ProviderCard.jsx';
import ProviderModal from './ProviderModal.jsx';

const BUDGETS = [
  { label: 'Any budget', min: '', max: '' },
  { label: 'Under ₹2,000', min: '', max: 1999 },
  { label: '₹2,000 – 3,000', min: 2000, max: 3000 },
  { label: 'Above ₹3,000', min: 3001, max: '' },
];
const TYPES = [['', 'Any'], ['veg', 'Veg'], ['nonveg', 'Non-veg']];
const MEALS = [['', 'Any'], ['lunch', 'Lunch'], ['dinner', 'Dinner'], ['both', 'Both']];
const SORTS = [['distance', 'Nearest'], ['rating', 'Top rated'], ['price', 'Lowest price']];

function Group({ label, options, value, onChange }) {
  return (
    <div className="grp" role="group" aria-label={label}>
      <span className="gl">{label}</span>
      {options.map(([v, text]) => (
        <button key={v} className={'chip' + (value === v ? ' on' : '')} aria-pressed={value === v} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}

export default function Search() {
  const [q, setQ] = useState('');
  const [budget, setBudget] = useState(0);
  const [type, setType] = useState('');
  const [meal, setMeal] = useState('');
  const [sort, setSort] = useState('distance');
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    const timer = setTimeout(() => {
      getProviders({ q, minPrice: BUDGETS[budget].min, maxPrice: BUDGETS[budget].max, type, meal, sort }, controller.signal)
        .then((data) => { setProviders(data); setStatus('done'); })
        .catch((err) => { if (err.name !== 'AbortError') setStatus('error'); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [q, budget, type, meal, sort]);

  return (
    <section id="find" className="alt">
      <div className="w">
        <h2>Find a mess near you</h2>
        <p className="lead">Search by area or name, then narrow down by budget, food type and meals.</p>
        <input className="field search" type="search" placeholder="Search by area or mess name (e.g. Hostel Road)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search messes" />
        <div className="filters">
          <div className="grp" role="group" aria-label="Monthly budget">
            <span className="gl">Budget</span>
            {BUDGETS.map((b, i) => (
              <button key={b.label} className={'chip' + (budget === i ? ' on' : '')} aria-pressed={budget === i} onClick={() => setBudget(i)}>{b.label}</button>
            ))}
          </div>
          <Group label="Food" options={TYPES} value={type} onChange={setType} />
          <Group label="Meals" options={MEALS} value={meal} onChange={setMeal} />
          <Group label="Sort by" options={SORTS} value={sort} onChange={setSort} />
        </div>

        <div className="results" aria-live="polite">
          {status === 'loading' && <p className="note">Loading messes…</p>}
          {status === 'error' && <p className="note err">Couldn’t load messes. Check that the server is running and try again.</p>}
          {status === 'done' && providers.length === 0 && <p className="note">No messes match these filters yet. Try a wider budget or clear a filter.</p>}
          {status === 'done' && providers.map((p, i) => <ProviderCard key={p._id} provider={p} index={i} onOpen={setSelected} />)}
        </div>
      </div>
      {selected && <ProviderModal provider={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
