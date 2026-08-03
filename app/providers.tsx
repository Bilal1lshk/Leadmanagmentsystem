"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Userprovider from "./context/Usercontext.jsx";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <Userprovider>{children}</Userprovider>
    </Provider>
  );
}
