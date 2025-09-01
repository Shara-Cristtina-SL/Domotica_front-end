// === API base ===
const API_URL = "http://31.97.22.121:8080"

// Helper para requisições
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Erro API: ${res.status} ${res.statusText}`);
  }
  if (res.status !== 204) {
    return res.json();
  }
  return null;
}

// === Cômodos ===
export async function listarComodos() {
  return request(`${API_URL}/comodos`);
}
export async function cadastrarComodo(data) {
  return request(`${API_URL}/comodos`, { 
    method: "POST", 
    body: JSON.stringify({
      nome: data.nome // string
    }) 
  });
}
export async function editarComodo(id, data) {
  return request(`${API_URL}/comodos/${id}`, { 
    method: "PUT", 
    body: JSON.stringify({
      nome: data.nome // string
    })
  });
}
export async function excluirComodo(id) {
  return request(`${API_URL}/comodos/${id}`, { method: "DELETE" });
}

// === Dispositivos ===
export async function listarDispositivos() {
  return request(`${API_URL}/dispositivos`);
}
export async function cadastrarDispositivo(data) {
  return request(`${API_URL}/dispositivos`, { 
    method: "POST", 
    body: JSON.stringify({
      nome: data.nome,    // string
      estado: data.estado, // boolean
      idComodo: data.idComodo // long
    }) 
  });
}
export async function editarDispositivo(id, data) {
  return request(`${API_URL}/dispositivos/${id}`, { 
    method: "PUT", 
    body: JSON.stringify({
      nome: data.nome,    // string
      estado: data.estado, // boolean
      idComodo: data.idComodo // long
    }) 
  });
}
export async function excluirDispositivo(id) {
  return request(`${API_URL}/dispositivos/${id}`, { method: "DELETE" });
}
export async function ligarDispositivo(id) {
  return request(`${API_URL}/dispositivos/${id}/ligar`, { method: "PUT" });
}
export async function desligarDispositivo(id) {
  return request(`${API_URL}/dispositivos/${id}/desligar`, { method: "PUT" });
}

// === Grupos ===
export async function listarGrupos() {
  return request(`${API_URL}/grupos`);
}
export async function cadastrarGrupo(data) {
  return request(`${API_URL}/grupos`, { 
    method: "POST", 
    body: JSON.stringify({
      nome: data.nome, // string
      dispositivos: data.dispositivos.map(id => ({ idDispositivo: id })) // array de objetos
    }) 
  });
}
export async function editarGrupo(id, data) {
  return request(`${API_URL}/grupos/${id}`, { 
    method: "PUT", 
    body: JSON.stringify({
      nome: data.nome, // string
      dispositivos: data.dispositivos.map(id => ({ idDispositivo: id }))
    })
  });
}
export async function excluirGrupo(id) {
  return request(`${API_URL}/grupos/${id}`, { method: "DELETE" });
}
export async function ligarGrupo(id) {
  return request(`${API_URL}/grupos/${id}/ligar`, { method: "POST" }); // sem body
}
export async function desligarGrupo(id) {
  return request(`${API_URL}/grupos/${id}/desligar`, { method: "POST" }); // sem body
}

// === Cenas ===
export async function listarCenas() {
  return request(`${API_URL}/cenas`);
}
export async function cadastrarCena(data) {
  return request(`${API_URL}/cenas`, { 
    method: "POST", 
    body: JSON.stringify({
      nome: data.nome,          // string
      descricao: data.descricao // string
    }) 
  });
}
export async function editarCena(id, data) {
  return request(`${API_URL}/cenas/${id}`, { 
    method: "PUT", 
    body: JSON.stringify({
      nome: data.nome,          // string
      descricao: data.descricao // string
    })
  });
}
export async function excluirCena(id) {
  return request(`${API_URL}/cenas/${id}`, { method: "DELETE" });
}
export async function ligarCena(id) {
  return request(`${API_URL}/cenas/${id}/ligar`, { method: "PUT" });
}
export async function desligarCena(id) {
  return request(`${API_URL}/cenas/${id}/desligar`, { method: "PUT" });
}

// === Ações de Cena ===
export async function listarAcoesCena() {
  return request(`${API_URL}/acaocenas`);
}
export async function cadastrarAcaoCena(data) {
  return request(`${API_URL}/acaocenas`, { 
    method: "POST", 
    body: JSON.stringify({
      nome: data.nome, // string
      cena: { idCena: data.idCena },
      dispositivos: data.dispositivos.map(id => ({ idDispositivo: id })),
      grupos: data.grupos.map(id => ({ idGrupo: id }))
    }) 
  });
}
export async function editarAcaoCena(id, data) {
  return request(`${API_URL}/acaocenas/${id}`, { 
    method: "PUT", 
    body: JSON.stringify({
      nome: data.nome, // string
      cena: { idCena: data.idCena },
      dispositivos: data.dispositivos.map(id => ({ idDispositivo: id })),
      grupos: data.grupos.map(id => ({ idGrupo: id }))
    })
  });
}
export async function excluirAcaoCena(id) {
  return request(`${API_URL}/acaocenas/${id}`, { method: "DELETE" });
}
export async function executarAcaoCena(id) {
  return request(`${API_URL}/acaocenas/${id}/executar`, { method: "PUT" });
}

// === Histórico ===
export async function listarHistorico() {
  return request(`${API_URL}/history`);
}
