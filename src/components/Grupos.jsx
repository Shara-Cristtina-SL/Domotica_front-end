import React, { useState } from "react";
import {
  listarGrupos,
  cadastrarGrupo,
  editarGrupo,
  excluirGrupo,
  ligarGrupo,
  desligarGrupo,
} from "../api/grupos";

import { listarDispositivos } from "../api/dispositivos";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";
import { usePolling } from "../hooks/usePolling";

export default function Grupos() {
  const [novoNome, setNovoNome] = useState("");
  const [novoDispositivos, setNovoDispositivos] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [editandoDispositivos, setEditandoDispositivos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  const {
    data: grupos,
    loading: loadingGrupos,
    error: errorGrupos,
    refetch: refetchGrupos,
  } = usePolling(listarGrupos, 5000);

  const {
    data: dispositivos,
    loading: loadingDispositivos,
    error: errorDispositivos,
    refetch: refetchDispositivos,
  } = usePolling(listarDispositivos, 5000);

  if (errorGrupos)
    setToast({ message: "Erro ao carregar grupos", variant: "error" });
  if (errorDispositivos)
    setToast({ message: "Erro ao carregar dispositivos", variant: "error" });

  async function handleCadastrar(e) {
    e.preventDefault();
    if (!novoNome.trim()) {
      setToast({ message: "Informe o nome do grupo", variant: "error" });
      return;
    }
    if (novoDispositivos.length === 0) {
      setToast({
        message: "Selecione pelo menos um dispositivo",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await cadastrarGrupo({ nome: novoNome, dispositivos: novoDispositivos });
      setToast({
        message: "Grupo cadastrado com sucesso!",
        variant: "success",
      });
      setNovoNome("");
      setNovoDispositivos([]);
      await refetchGrupos();
      await refetchDispositivos();
    } catch {
      setToast({ message: "Erro ao cadastrar grupo", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  function iniciarEdicao(grupo) {
    setEditandoId(grupo.idGrupo);
    setEditandoNome(grupo.nome);
    setEditandoDispositivos(grupo.dispositivos.map((d) => d.idDispositivo));
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditandoNome("");
    setEditandoDispositivos([]);
  }

  async function salvarEdicao() {
    if (!editandoNome.trim()) {
      setToast({ message: "Informe o nome do grupo", variant: "error" });
      return;
    }
    if (editandoDispositivos.length === 0) {
      setToast({
        message: "Selecione pelo menos um dispositivo",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await editarGrupo(editandoId, {
        nome: editandoNome,
        dispositivos: editandoDispositivos,
      });
      setToast({ message: "Grupo editado com sucesso!", variant: "success" });
      cancelarEdicao();
      await refetchGrupos();
      await refetchDispositivos();
    } catch {
      setToast({ message: "Erro ao editar grupo", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir(idGrupo) {
    setLoading(true);
    try {
      await excluirGrupo(idGrupo);
      setToast({ message: "Grupo excluído com sucesso!", variant: "success" });
      await refetchGrupos();
      await refetchDispositivos();
    } catch {
      setToast({ message: "Erro ao excluir grupo", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleLigar(idGrupo) {
    setLoading(true);
    try {
      await ligarGrupo(idGrupo);
      setToast({ message: "Grupo ligado!", variant: "success" });
      await refetchGrupos();
      await refetchDispositivos();
    } catch {
      setToast({ message: "Erro ao ligar grupo", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDesligar(idGrupo) {
    setLoading(true);
    try {
      await desligarGrupo(idGrupo);
      setToast({ message: "Grupo desligado!", variant: "success" });
      await refetchGrupos();
      await refetchDispositivos();
    } catch {
      setToast({ message: "Erro ao desligar grupo", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-wide">
          Lista de Grupos
        </h1>
        <p className="mt-2 text-slate-500">
          Agrupe dispositivos para controlá-los de uma só vez.
        </p>
      </div>

      <form
        onSubmit={handleCadastrar}
        className="p-6 border border-slate-200 rounded-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nome do Grupo
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="Ex: Luzes da Sala"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button
              label="Cadastrar Grupo"
              onClick={handleCadastrar}
              variant="create"
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Selecione os Dispositivos
            </label>
            <div className="max-h-56 overflow-auto border rounded-lg p-4 bg-slate-50 space-y-3">
              {dispositivos?.map((dispositivo) => (
                <label
                  key={dispositivo.idDispositivo}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={dispositivo.idDispositivo}
                    checked={novoDispositivos.includes(
                      dispositivo.idDispositivo
                    )}
                    onChange={(e) => {
                      const id = dispositivo.idDispositivo;
                      if (e.target.checked)
                        setNovoDispositivos([...novoDispositivos, id]);
                      else
                        setNovoDispositivos(
                          novoDispositivos.filter((i) => i !== id)
                        );
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700">{dispositivo.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>

      {loading || loadingGrupos || loadingDispositivos ? <Spinner /> : null}

      <ul className="space-y-4">
        {grupos?.map((grupo) => (
          <li
            key={grupo.idGrupo}
            className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-xl transition-all"
          >
            {editandoId === grupo.idGrupo ? (
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="editGroupName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Nome do Grupo
                    </label>
                    <input
                      id="editGroupName"
                      type="text"
                      value={editandoNome}
                      onChange={(e) => setEditandoNome(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Selecione os Dispositivos
                    </label>
                    <div className="max-h-40 overflow-auto border rounded-lg p-3 bg-white space-y-2">
                      {dispositivos?.map((dispositivo) => (
                        <label
                          key={dispositivo.idDispositivo}
                          className="flex items-center gap-3 p-1 rounded-md hover:bg-slate-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={dispositivo.idDispositivo}
                            checked={editandoDispositivos.includes(
                              dispositivo.idDispositivo
                            )}
                            onChange={(e) => {
                              const id = dispositivo.idDispositivo;
                              if (e.target.checked)
                                setEditandoDispositivos([
                                  ...editandoDispositivos,
                                  id,
                                ]);
                              else
                                setEditandoDispositivos(
                                  editandoDispositivos.filter((i) => i !== id)
                                );
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-700">
                            {dispositivo.nome}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancelar"
                    onClick={cancelarEdicao}
                    variant="delete"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                  />
                  <Button
                    label="Salvar"
                    onClick={salvarEdicao}
                    variant="edit"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:justify-between">
                <div className="flex items-start gap-4 flex-grow mb-4 sm:mb-0">
                  <div className="p-2 bg-white rounded-md">
                    <img
                      src="https://img.icons8.com/?size=100&id=3703&format=png&color=000000"
                      alt="Ícone Grupo"
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl text-gray-800 font-semibold">
                      {grupo.nome}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {grupo.dispositivos.length > 0 ? (
                        grupo.dispositivos.map((d) => (
                          <span
                            key={d.idDispositivo}
                            className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded-full"
                          >
                            {d.nome}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">
                          Nenhum dispositivo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end flex-shrink-0">
                  <button
                    onClick={() => handleLigar(grupo.idGrupo)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                    title="Ligar Grupo"
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
                        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDesligar(grupo.idGrupo)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    title="Desligar Grupo"
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
                        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => iniciarEdicao(grupo)}
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
                    onClick={() => handleExcluir(grupo.idGrupo)}
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
              </div>
            )}
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
