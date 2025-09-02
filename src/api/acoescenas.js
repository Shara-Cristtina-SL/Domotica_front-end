import { request } from "./http";

export function listarAcoesCena() {
  return request("/acaocenas");
}

export function cadastrarAcaoCena({
  nome,
  ordem,
  intervaloSegundos,
  estadoDesejado,
  idCena,
  dispositivos,
  grupos,
}) {
  return request("/acaocenas", {
    method: "POST",
    body: JSON.stringify({
      nome,
      ordem,
      intervaloSegundos,
      estadoDesejado,
      cena: { idCena },
      dispositivos: dispositivos.map((d) => ({ idDispositivo: d })),
      grupos: grupos.map((g) => ({ idGrupo: g })),
    }),
  });
}

export function editarAcaoCena(
  id,
  {
    nome,
    ordem,
    intervaloSegundos,
    estadoDesejado,
    idCena,
    dispositivos,
    grupos,
  }
) {
  return request(`/acaocenas/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nome,
      ordem,
      intervaloSegundos,
      estadoDesejado,
      cena: { idCena },
      dispositivos: dispositivos.map((d) => ({ idDispositivo: d })),
      grupos: grupos.map((g) => ({ idGrupo: g })),
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
