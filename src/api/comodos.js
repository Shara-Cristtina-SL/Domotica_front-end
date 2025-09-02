import { request } from "./http";

export function listarComodos() {
  return request("/comodos");
}

export function cadastrarComodo({ nome }) {
  return request("/comodos", {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

export function editarComodo(id, { nome }) {
  return request(`/comodos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nome }),
  });
}

export function excluirComodo(id) {
  return request(`/comodos/${id}`, {
    method: "DELETE",
  });
}
