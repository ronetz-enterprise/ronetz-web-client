import { RouteurPage } from "./RouteurPage";
import type { RouteurActions } from "./routeurColumns";
import type { Routeur } from "../types";

export function RouteurTable(props: RouteurActions & { routeurs: Routeur[]; loading: boolean }) {
  return <RouteurPage {...props} />;
}
