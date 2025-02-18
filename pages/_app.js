import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;