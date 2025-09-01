import { request } from "./http";

export function listarHistorico() {
  return request("/history");
}
