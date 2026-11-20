import Search from './components/Search.jsx';
import WaitlistForm from './components/WaitlistForm.jsx';
import ListMessForm from './components/ListMessForm.jsx';

export default function App() {
  return (
    <>
      <header>
        <div className="w bar">
          <img className="logo" src="/logo.jpg" alt="Tiffly logo" />
          <a className="btn" href="#find">Find a mess</a>
        </div>
      </header>

      <main>
        <div className="w hero">
          <div>
            <h1>Good food. No guesswork.</h1>
            <p>Tiffly helps you find, compare and subscribe to nearby mess and tiffin providers in one place. Made for students, hostel and PG residents, and anyone living away from home.</p>
            <div className="cta">
              <a className="btn" href="#find">Find a mess</a>
              <a className="btn o" href="#how">See how it works</a>
            </div>
          </div>
        </div>

        <Search />

        <section id="how">
          <div className="w">
            <h2>From search to subscription in three steps</h2>
            <p className="lead">No more asking around hostels or guessing which mess is good.</p>
            <ol className="steps">
              <li><h3>Search</h3><p>Enter your area and monthly budget to see messes and tiffin services near you.</p></li>
              <li><h3>Compare</h3><p>Check daily menus, ratings, reviews and meal plans side by side.</p></li>
              <li><h3>Subscribe</h3><p>Pick a weekly or monthly plan and send a request to the provider.</p></li>
            </ol>
          </div>
        </section>

        <section className="alt" id="providers">
          <div className="w two">
            <div>
              <h2>Run a mess or tiffin service?</h2>
              <p className="lead">Tiffly puts your food in front of people searching nearby every day.</p>
              <ul className="plain">
                <li>Reach new students and professionals in your area</li>
                <li>Show your daily menu and plans in one profile</li>
                <li>Build trust with ratings from real customers</li>
              </ul>
            </div>
            <ListMessForm />
          </div>
        </section>

        <section className="join" id="join">
          <div className="w">
            <h2>Be first to try Tiffly</h2>
            <p className="lead">We’re building Tiffly in Lucknow and testing with students and mess owners. Leave your email and we’ll tell you when it opens near you.</p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer><div className="w">© 2026 Tiffly · Good food. No guesswork. Just Tiffly.</div></footer>
    </>
  );
}
