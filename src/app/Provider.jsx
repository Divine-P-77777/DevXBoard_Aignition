"use client";
import { usePathname } from 'next/navigation';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalLoader from "@/components/ui/GlobalLoader";
import ToastContainer from "@/components/ui/ToastContainer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalLoaderWrapper from '@/components/ui/GlobalLoader';
import useLenis from "@/hooks/useLenisScroll";
import ServerDown from "@/components/ui/ServerDown";
import { useServerStatus } from "@/hooks/useServerStatus";

export default function ReduxProvider({ children }) {
  const pathname = usePathname();
    const serverDown = useServerStatus();
      if (serverDown) return <ServerDown />;


  const hideNavFoot = pathname.startsWith('/template/view/');
    useLenis();
  return (
    <Provider store={store}>
      {/* PersistGate ensures store is hydrated */}
      <PersistGate loading={<GlobalLoader />} persistor={persistor}>
        <AuthProvider>
       {!hideNavFoot && <Navbar />}
          <ToastContainer />
              <GlobalLoaderWrapper>
          {children}
          </GlobalLoaderWrapper>
           {!hideNavFoot && <Footer />}

        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
