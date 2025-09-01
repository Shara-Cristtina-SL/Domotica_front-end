import { request } from "./http";

export function listarCenas() {
  return request("/cenas");
}

export function cadastrarCena({ nome, descricao }) {
  return request("/cenas", {
    method: "POST",
    body: JSON.stringify({ nome, descricao }),
  });
}

export function editarCena(id, { nome, descricao }) {
  return request(`/cenas/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nome, descricao }),
  });
}

export function excluirCena(id) {
  return request(`/cenas/${id}`, {
    method: "DELETE",
  });
}

export function ligarCena(id) {
  return request(`/cenas/${id}/ligar`, {
    method: "PUT",
  });
}

export function desligarCena(id) {
  return request(`/cenas/${id}/desligar`, {
    method: "PUT",
  });
}
