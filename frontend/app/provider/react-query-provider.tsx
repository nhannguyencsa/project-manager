import { AuthProvider } from "@/provider/auth-context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {Toaster} from "sonner";

export const queryClient = new QueryClient();

// ReactQueryProvider allow to use useQuery, useMutation to handle data fetching and caching
//client is a QueryClient instance used to manage cache, queries, mutations, and refetching
const ReactQueryProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}> 
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors/>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;

