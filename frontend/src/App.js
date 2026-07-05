import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvitationPage from "@/pages/InvitationPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App bg-[#0A0A0A] min-h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "#171717",
            border: "1px solid #107C10",
            color: "#fff",
            fontFamily: "'Chakra Petch', sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
