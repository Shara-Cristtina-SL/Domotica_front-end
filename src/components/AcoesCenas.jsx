import React, { useState } from "react";
import {
  listarAcoesCena,
  cadastrarAcaoCena,
  editarAcaoCena,
  excluirAcaoCena,
  executarAcaoCena,
} from "../api/acoescenas";

import { listarCenas } from "../api/cenas";
import { listarDispositivos } from "../api/dispositivos";
import { listarGrupos } from "../api/grupos";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";
import { usePolling } from "../hooks/usePolling"; // Importando o hook usePolling

export default function AcoesCena() {
  const [nome, setNome] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [intervaloSegundos, setIntervaloSegundos] = useState(0);
  const [estadoDesejado, setEstadoDesejado] = useState(true);
  const [idCena, setIdCena] = useState("");
  const [dispositivosSelecionados, setDispositivosSelecionados] = useState([]);
  const [gruposSelecionados, setGruposSelecionados] = useState([]);

  const [editandoId, setEditandoId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  const {
    data: acoes,
    error: errorAcoes,
    loading: loadingAcoes,
  } = usePolling(listarAcoesCena, 5000);

  const {
    data: cenas,
    error: errorCenas,
    loading: loadingCenas,
  } = usePolling(listarCenas, 5000);

  const {
    data: dispositivos,
    error: errorDispositivos,
    loading: loadingDispositivos,
  } = usePolling(listarDispositivos, 5000);

  const {
    data: grupos,
    error: errorGrupos,
    loading: loadingGrupos,
  } = usePolling(listarGrupos, 5000);

  if (errorAcoes || errorCenas || errorDispositivos || errorGrupos) {
    setToast({ message: "Erro ao carregar dados", variant: "error" });
  }

  function resetForm() {
    setNome("");
    setOrdem(1);
    setIntervaloSegundos(0);
    setEstadoDesejado(true);
    setIdCena("");
    setDispositivosSelecionados([]);
    setGruposSelecionados([]);
  }

  function validarFormulario() {
    if (!nome.trim()) {
      setToast({ message: "Informe o nome da ação", variant: "error" });
      return false;
    }
    if (!idCena) {
      setToast({ message: "Selecione uma cena", variant: "error" });
      return false;
    }
    return true;
  }

  function handleCadastrar() {
    if (!validarFormulario()) return;

    setLoading(true);
    cadastrarAcaoCena({
      nome,
      ordem: Number(ordem),
      intervaloSegundos: Number(intervaloSegundos),
      estadoDesejado,
      idCena: Number(idCena),
      dispositivos: dispositivosSelecionados.map(Number),
      grupos: gruposSelecionados.map(Number),
    })
      .then(() => {
        setToast({
          message: "Ação cadastrada com sucesso!",
          variant: "success",
        });
        resetForm();
      })
      .catch(() =>
        setToast({ message: "Erro ao cadastrar ação", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function iniciarEdicao(acao) {
    setEditandoId(acao.idAcao);
    setNome(acao.nome);
    setOrdem(acao.ordem);
    setIntervaloSegundos(acao.intervaloSegundos);
    setEstadoDesejado(acao.estadoDesejado);
    setIdCena(acao.cena?.idCena?.toString() || "");
    setDispositivosSelecionados(acao.dispositivos.map((d) => d.idDispositivo));
    setGruposSelecionados(acao.grupos.map((g) => g.idGrupo));
  }

  function cancelarEdicao() {
    setEditandoId(null);
    resetForm();
  }

  function handleSalvarEdicao() {
    if (!validarFormulario()) return;

    setLoading(true);
    editarAcaoCena(editandoId, {
      nome,
      ordem: Number(ordem),
      intervaloSegundos: Number(intervaloSegundos),
      estadoDesejado,
      idCena: Number(idCena),
      dispositivos: dispositivosSelecionados.map(Number),
      grupos: gruposSelecionados.map(Number),
    })
      .then(() => {
        setToast({ message: "Ação editada com sucesso!", variant: "success" });
        cancelarEdicao();
      })
      .catch(() =>
        setToast({ message: "Erro ao editar ação", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExcluir(id) {
    setLoading(true);
    excluirAcaoCena(id)
      .then(() => {
        setToast({ message: "Ação excluída com sucesso!", variant: "success" });
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir ação", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExecutar(id) {
    setLoading(true);
    executarAcaoCena(id)
      .then(() => setToast({ message: "Ação executada!", variant: "success" }))
      .catch(() =>
        setToast({ message: "Erro ao executar ação", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function toggleSelecionado(id, selecionados, setSelecionados) {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((v) => v !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ações de Cena</h2>

      <div className="flex flex-col space-y-2 border p-4 rounded-md">
        <input
          type="text"
          placeholder="Nome da ação"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Ordem"
          min={1}
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Intervalo (segundos)"
          min={0}
          value={intervaloSegundos}
          onChange={(e) => setIntervaloSegundos(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={estadoDesejado}
            onChange={(e) => setEstadoDesejado(e.target.checked)}
          />
          <span>Estado desejado: ligado?</span>
        </label>

        <select
          value={idCena}
          onChange={(e) => setIdCena(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Selecione uma cena</option>
          {cenas?.map((c) => (
            <option key={c.idCena} value={c.idCena}>
              {c.nome}
            </option>
          ))}
        </select>

        <fieldset className="border rounded p-2 max-h-40 overflow-auto">
          <legend className="font-semibold mb-1">Dispositivos</legend>
          <div className="grid grid-cols-2 gap-2">
            {(Array.isArray(dispositivos) ? dispositivos : []).map((d) => (
              <label
                key={d.idDispositivo}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={dispositivosSelecionados.includes(d.idDispositivo)}
                  onChange={() =>
                    toggleSelecionado(
                      d.idDispositivo,
                      dispositivosSelecionados,
                      setDispositivosSelecionados
                    )
                  }
                />
                <span>{d.nome}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border rounded p-2 max-h-40 overflow-auto mt-2">
          <legend className="font-semibold mb-1">Grupos</legend>
          <div className="grid grid-cols-2 gap-2">
            {(Array.isArray(grupos) ? grupos : []).map((g) => (
              <label key={g.idGrupo} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gruposSelecionados.includes(g.idGrupo)}
                  onChange={() =>
                    toggleSelecionado(
                      g.idGrupo,
                      gruposSelecionados,
                      setGruposSelecionados
                    )
                  }
                />
                <span>{g.nome}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex space-x-2 mt-2">
          {editandoId ? (
            <>
              <Button
                label="Salvar"
                onClick={handleSalvarEdicao}
                variant="edit"
                disabled={loading}
              />
              <Button
                label="Cancelar"
                onClick={cancelarEdicao}
                variant="default"
                disabled={loading}
              />
            </>
          ) : (
            <Button
              label="Cadastrar"
              onClick={handleCadastrar}
              variant="create"
              disabled={loading}
            />
          )}
        </div>
      </div>

      {loading ||
      loadingDispositivos ||
      loadingAcoes ||
      loadingCenas ||
      loadingGrupos ? (
        <Spinner />
      ) : null}

      <ul className="mt-6 space-y-4">
        {(Array.isArray(acoes) ? acoes : []).map((acao) => (
          <li key={acao.idAcao} className="border p-4 rounded-md shadow">
            <div className="flex justify-between items-center mb-2">
              <strong>{acao.nome}</strong>
              <div className="space-x-2">
                <Button
                  label="Editar"
                  variant="edit"
                  onClick={() => iniciarEdicao(acao)}
                />
                <Button
                  label="Excluir"
                  variant="delete"
                  onClick={() => handleExcluir(acao.idAcao)}
                />
                <Button
                  label="Executar"
                  variant="default"
                  onClick={() => handleExecutar(acao.idAcao)}
                />
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <strong>Ordem:</strong> {acao.ordem}
              </p>
              <p>
                <strong>Intervalo (segundos):</strong> {acao.intervaloSegundos}
              </p>
              <p>
                <strong>Estado desejado:</strong>{" "}
                {acao.estadoDesejado ? "Ligado" : "Desligado"}
              </p>
              <p>
                <strong>Cena:</strong> {acao.cena?.nome || "N/A"}
              </p>
              <p>
                <strong>Dispositivos:</strong>{" "}
                {acao.dispositivos.map((d) => d.nome).join(", ") || "Nenhum"}
              </p>
              <p>
                <strong>Grupos:</strong>{" "}
                {acao.grupos.map((g) => g.nome).join(", ") || "Nenhum"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Toast
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ message: "", variant: "success" })}
      />
    </div>
  );
}
