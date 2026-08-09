"use client";

import { Provider } from "react-redux";
import store from "./redux/store";
import Userprovider from "./context/Usercontext.jsx";


export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <Provider store={store}>
      <Userprovider>{children}</Userprovider>
    </Provider>
  );
}