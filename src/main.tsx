import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
	fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx',message:'App initialization started',data:{hasRoot:!!document.getElementById("root")},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
}
// #endregion

createRoot(document.getElementById("root")!).render(<App />);

// #region agent log
// #endregion
// #region agent log
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
	fetch('http://127.0.0.1:7242/ingest/edd1edcc-d15d-43a6-9166-0f43d8e0a0e0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'App rendered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
}
// #endregion
