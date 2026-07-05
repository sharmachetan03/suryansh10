import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import InvitationPage from "@/pages/InvitationPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App bg-[#F5F5F5] min-h-screen text-neutral-900">
      <HashRouter>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
        </Routes>
      </HashRouter>
      <Toaster
        theme="light"
        position="top-center"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            border: "1px solid #107C10",
            color: "#0A0A0A",
            fontFamily: "'Chakra Petch', sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
