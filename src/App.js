import { SearchProvider } from "./context/SearchContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRouter from "./routers/AppRouter";

function App() {
  return (
    <SearchProvider>
      <Header />
      <AppRouter />
      <Footer />
    </SearchProvider>
  );
}

export default App;
