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
import { usePolling } from "../hooks/usePolling";

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
    refetch: refetchAcoes,
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
        refetchAcoes();
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
        refetchAcoes();
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
        refetchAcoes();
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir ação", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExecutar(id) {
    setLoading(true);

    executarAcaoCena(id)
      .then(() => {
        setToast({ message: "Ação executada!", variant: "success" });
        refetchAcoes();
      })
      .catch((error) => {
        const errorMessage = error.message || "Erro ao executar ação";

        setToast({ message: errorMessage, variant: "error" });
      })
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
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-white rounded-xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-wide">
          Ações de Cena
        </h1>
        <p className="mt-2 text-slate-500">
          Crie e gerencie os passos que compõem cada cena.
        </p>
      </div>

      <form className="p-6 bg-white border border-slate-200 rounded-lg mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2">
              1. Detalhes da Ação
            </h3>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Nome da Ação
              </label>
              <input
                type="text"
                placeholder="Ex: Ligar luz principal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-slate-50 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4"></div>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-md cursor-pointer">
              <input
                type="checkbox"
                checked={estadoDesejado}
                onChange={(e) => setEstadoDesejado(e.target.checked)}
                className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">
                Estado desejado: LIGADO
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2">
              2. O Que Controlar?
            </h3>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Dispositivos
              </label>
              <div className="max-h-40 overflow-auto border rounded-lg p-2 bg-slate-50 space-y-1">
                {dispositivos?.map((d) => (
                  <label
                    key={d.idDispositivo}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={dispositivosSelecionados.includes(
                        d.idDispositivo
                      )}
                      onChange={() =>
                        toggleSelecionado(
                          d.idDispositivo,
                          dispositivosSelecionados,
                          setDispositivosSelecionados
                        )
                      }
                      className="h-4 w-4 rounded text-indigo-600"
                    />
                    <span>{d.nome}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Grupos
              </label>
              <div className="max-h-40 overflow-auto border rounded-lg p-2 bg-slate-50 space-y-1">
                {grupos?.map((g) => (
                  <label
                    key={g.idGrupo}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-200 cursor-pointer"
                  >
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
                      className="h-4 w-4 rounded text-indigo-600"
                    />
                    <span>{g.nome}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2">
              3. Associar e Finalizar
            </h3>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Associar à Cena
              </label>
              <select
                value={idCena}
                onChange={(e) => setIdCena(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-slate-50 border rounded-md appearance-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione uma cena</option>
                {cenas?.map((c) => (
                  <option key={c.idCena} value={c.idCena}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-5">
              {editandoId ? (
                <div className="flex gap-3">
                  <Button
                    label="Salvar"
                    onClick={handleSalvarEdicao}
                    variant="edit"
                    disabled={loading}
                    className="w-full text-white bg-green-600 hover:bg-green-700"
                  />
                  <Button
                    label="Cancelar"
                    onClick={cancelarEdicao}
                    variant="delete"
                    disabled={loading}
                    className="w-full bg-slate-200 hover:bg-slate-300"
                  />
                </div>
              ) : (
                <Button
                  label="Cadastrar Ação"
                  onClick={handleCadastrar}
                  variant="create"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {loading ||
      loadingDispositivos ||
      loadingAcoes ||
      loadingCenas ||
      loadingGrupos ? (
        <Spinner />
      ) : null}

      <ul className="mt-6 space-y-4">
        {acoes?.map((acao) => (
          <li
            key={acao.idAcao}
            className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-start gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-2/5">
              <div className="relative flex-shrink-0 w-10 h-10">
                <img
                  src="https://img.icons8.com/?size=100&id=hxPReN9KS3vE&format=png&color=000000"
                  alt="Ícone de Ação"
                  className="w-full h-full"
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {acao.ordem}
                </span>
              </div>

              <div>
                <strong className="text-lg text-slate-800">{acao.nome}</strong>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      acao.estadoDesejado ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                      />
                    </svg>
                    {acao.estadoDesejado ? "Ligar" : "Desligar"}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <div className="text-xs">
                <strong className="text-slate-600">Dispositivos:</strong>
                <span className="ml-2">
                  {acao.dispositivos.length > 0
                    ? acao.dispositivos.map((d) => (
                        <span
                          key={d.idDispositivo}
                          className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mr-1 mb-1"
                        >
                          {d.nome}
                        </span>
                      ))
                    : "Nenhum"}
                </span>
              </div>
              <div className="text-xs mt-1">
                <strong className="text-slate-600">Grupos:</strong>
                <span className="ml-2">
                  {acao.grupos.length > 0
                    ? acao.grupos.map((g) => (
                        <span
                          key={g.idGrupo}
                          className="inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full mr-1 mb-1"
                        >
                          {g.nome}
                        </span>
                      ))
                    : "Nenhum"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-none pt-3 md:pt-0 mt-3 md:mt-0">
              <button
                onClick={() => handleExecutar(acao.idAcao)}
                className="p-2 text-sky-600 hover:bg-sky-100 rounded-full transition-colors"
                title="Executar Ação"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => iniciarEdicao(acao)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-colors"
                title="Editar"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleExcluir(acao.idAcao)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-200 rounded-full transition-colors"
                title="Excluir"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.884v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
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
