import Award from './components/Award';
import Chart from './components/Chart';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Toolkit from './components/Toolkit';
import Work from './components/Work';

// Sections marked data-shot are open to the 3D scene behind them; the camera moves to
// a new angle on the ship for each. The others are solid sheets for reading.
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
        <Award />
        <Experience />
        <Toolkit />
        <Chart />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
