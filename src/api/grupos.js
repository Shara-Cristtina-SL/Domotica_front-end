import { request } from "./http";

export function listarGrupos() {
  return request("/grupos");
}

export function cadastrarGrupo({ nome, dispositivos }) {
  return request("/grupos", {
    method: "POST",
    body: JSON.stringify({
      nome,
      dispositivos: dispositivos.map((id) => ({ idDispositivo: id })),
    }),
  });
}

export function editarGrupo(id, { nome, dispositivos }) {
  return request(`/grupos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome,
      dispositivos: dispositivos.map((id) => ({ idDispositivo: id })),
    }),
  });
}

export function excluirGrupo(id) {
  return request(`/grupos/${id}`, {
    method: "DELETE",
  });
}

export function ligarGrupo(id) {
  return request(`/grupos/${id}/ligar`, {
    method: "POST",
  });
}

export function desligarGrupo(id) {
  return request(`/grupos/${id}/desligar`, {
    method: "POST",
  });
}
