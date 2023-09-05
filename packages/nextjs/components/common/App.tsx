import type { FunctionComponent, PropsWithChildren } from "react";
import Nav from "~~/components/common/Nav";

const App: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-screen text-dark1 overflow-x-hidden font-inter">
      <Nav></Nav>
      {children}
    </div>
  );
};

export default App;
