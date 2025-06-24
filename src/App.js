import { SearchProvider } from "./context/SearchContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRouter from "./routers/AppRouter";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isChatRoomPage = location.pathname.startsWith("/chat/");

  return (
    <SearchProvider>
      {!isChatRoomPage && <Header />}
      <AppRouter />
      {!isChatRoomPage && <Footer />}
    </SearchProvider>
  );
}

export default App;
