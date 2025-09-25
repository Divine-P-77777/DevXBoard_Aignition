"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalLoader from "@/components/ui/GlobalLoader"; 

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<GlobalLoader fullscreen />} persistor={persistor}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
