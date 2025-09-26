"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalLoader from "@/components/ui/GlobalLoader";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {/* PersistGate ensures store is hydrated */}
      <PersistGate loading={<GlobalLoader />} persistor={persistor}>
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
