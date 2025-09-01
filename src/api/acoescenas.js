import { request } from "./http";

export function listarAcoesCena() {
  return request("/acaocenas");
}

export function cadastrarAcaoCena({ nome, idCena, dispositivos, grupos }) {
  return request("/acaocenas", {
    method: "POST",
    body: JSON.stringify({
      nome,
      cena: { idCena },
      dispositivos: dispositivos.map((id) => ({ idDispositivo: id })),
      grupos: grupos.map((id) => ({ idGrupo: id })),
    }),
  });
}

export function editarAcaoCena(id, { nome, idCena, dispositivos, grupos }) {
  return request(`/acaocenas/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome,
      cena: { idCena },
      dispositivos: dispositivos.map((id) => ({ idDispositivo: id })),
      grupos: grupos.map((id) => ({ idGrupo: id })),
    }),
  });
}

export function excluirAcaoCena(id) {
  return request(`/acaocenas/${id}`, {
    method: "DELETE",
  });
}

export function executarAcaoCena(id) {
  return request(`/acaocenas/${id}/executar`, {
    method: "PUT",
  });
}
