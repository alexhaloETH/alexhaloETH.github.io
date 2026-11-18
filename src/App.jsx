import Contact from './components/Contact.jsx';
import Elsewhere from './components/Elsewhere.jsx';
import Experience from './components/Experience.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Inventory from './components/Inventory.jsx';
import Work from './components/Work.jsx';

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Inventory />
        <Elsewhere />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
