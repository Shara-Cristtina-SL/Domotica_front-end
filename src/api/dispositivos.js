import { request } from "./http";

export function listarDispositivos() {
  return request("/dispositivos");
}

export function cadastrarDispositivo({ nome, estado, idComodo }) {
  return request("/dispositivos", {
    method: "POST",
    body: JSON.stringify({
      nome,
      estado,
      idComodo,
    }),
  });
}

export function editarDispositivo(id, { nome, estado, idComodo }) {
  return request(`/dispositivos/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome,
      estado,
      idComodo,
    }),
  });
}

export function excluirDispositivo(id) {
  return request(`/dispositivos/${id}`, {
    method: "DELETE",
  });
}

export function ligarDispositivo(id) {
  return request(`/dispositivos/${id}/ligar`, {
    method: "PUT",
  });
}

export function desligarDispositivo(id) {
  return request(`/dispositivos/${id}/desligar`, {
    method: "PUT",
  });
}
