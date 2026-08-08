"use client";

import { Provider } from "react-redux";
import store from "./redux/store";
import Userprovider from "./context/Usercontext.jsx";

console.log("🔥 STORE OBJECT:", store);

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(
    "🔥 LEADS INSIDE PROVIDER:",
    store.getState().LeadSlice
  );

  return (
    <Provider store={store}>
      <Userprovider>{children}</Userprovider>
    </Provider>
  );
}