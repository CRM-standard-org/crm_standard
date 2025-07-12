import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./routes/router";
import { ToastProvider } from "@/components/customs/alert/toast.main.component"; 

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
