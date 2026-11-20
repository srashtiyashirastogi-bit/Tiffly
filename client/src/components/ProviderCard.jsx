const COLORS = ['#f7941d', '#1b5e2f', '#0ea5e9', '#7c3aed', '#e11d48'];
const TYPE = { veg: 'Veg', nonveg: 'Non-veg', both: 'Veg + Non-veg' };
const MEALS = { lunch: 'Lunch', dinner: 'Dinner', both: 'Lunch + Dinner' };

export default function ProviderCard({ provider, index, onOpen }) {
  return (
    <button className="mc" onClick={() => onOpen(provider)} aria-label={`View ${provider.name}`}>
      <i style={{ background: COLORS[index % COLORS.length] }}>{provider.name[0]}</i>
      <div>
        <b>{provider.name}</b>
        <span>
          {provider.distanceKm} km · {TYPE[provider.type]} · {MEALS[provider.meals]}
        </span>
        <span className="rate">★ {provider.rating.toFixed(1)} ({provider.reviewCount}){provider.verified && ' · Verified'}</span>
      </div>
      <em>
        ₹{provider.monthlyPrice.toLocaleString('en-IN')}
        <small>per month</small>
      </em>
    </button>
  );
}
