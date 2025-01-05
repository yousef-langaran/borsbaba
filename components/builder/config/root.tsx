import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {DefaultRootProps} from "@measured/puck";

export type RootProps = DefaultRootProps;

function Root({ children, puck }: RootProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}

export default Root;
