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
  useLenis();                           

  const hideNavFoot = pathname.startsWith('/template/view/');

  return (
    <Provider store={store}>
      <PersistGate loading={<GlobalLoader />} persistor={persistor}>
        <AuthProvider>
          {/* render warning UI while keeping hooks stable */}
          {serverDown ? (
            <ServerDown />
          ) : (
            <>
              {!hideNavFoot && <Navbar />}
              <ToastContainer />
              <GlobalLoaderWrapper>
                {children}
              </GlobalLoaderWrapper>
              {!hideNavFoot && <Footer />}
            </>
          )}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
