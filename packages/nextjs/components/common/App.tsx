import type { FunctionComponent, PropsWithChildren } from "react";
import Nav from "~~/components/common/Nav";

const App: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full text-dark1">
      <Nav></Nav>
      {children}
    </div>
  );
};

export default App;
