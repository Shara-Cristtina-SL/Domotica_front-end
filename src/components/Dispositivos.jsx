import React, { useState } from "react";
import {
  listarDispositivos,
  cadastrarDispositivo,
  editarDispositivo,
  excluirDispositivo,
  ligarDispositivo,
  desligarDispositivo,
} from "../api/dispositivos";

import { listarComodos } from "../api/comodos";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";
import { usePolling } from "../hooks/usePolling";

export default function Dispositivos() {
  const [novoNome, setNovoNome] = useState("");
  const [novoEstado, setNovoEstado] = useState(false);
  const [novoIdComodo, setNovoIdComodo] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [editandoIdComodo, setEditandoIdComodo] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  const {
    data: dispositivos,
    error: errorDispositivos,
    loading: loadingDispositivos,
    refetch: refetchDispositivos,
  } = usePolling(listarDispositivos, 5000);

  const {
    data: comodos,
    error: errorComodos,
    loading: loadingComodos,
  } = usePolling(listarComodos, 5000);

  if (errorDispositivos) {
    setToast({ message: "Erro ao carregar dispositivos", variant: "error" });
  }

  if (errorComodos) {
    setToast({ message: "Erro ao carregar cômodos", variant: "error" });
  }

  function handleCadastrar(e) {
    e.preventDefault();
    if (!novoNome.trim()) {
      setToast({ message: "Informe o nome do dispositivo", variant: "error" });
      return;
    }

    if (!novoIdComodo) {
      setToast({ message: "Selecione um cômodo", variant: "error" });
      return;
    }

    setLoading(true);
    cadastrarDispositivo({
      nome: novoNome,
      estado: novoEstado,
      idComodo: novoIdComodo,
    })
      .then(() => {
        setToast({
          message: "Dispositivo cadastrado com sucesso!",
          variant: "success",
        });
        setNovoNome("");
        setNovoEstado(false);
        setNovoIdComodo("");
        refetchDispositivos();
      })
      .catch(() =>
        setToast({ message: "Erro ao cadastrar dispositivo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function iniciarEdicao(dispositivo) {
    setEditandoId(dispositivo.idDispositivo);
    setEditandoNome(dispositivo.nome);
    setEditandoEstado(dispositivo.estado);
    setEditandoIdComodo(dispositivo.idComodo);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditandoNome("");
    setEditandoEstado(false);
    setEditandoIdComodo("");
  }

  function salvarEdicao() {
    if (!editandoNome.trim()) {
      setToast({ message: "Informe o nome do dispositivo", variant: "error" });
      return;
    }

    if (!editandoIdComodo) {
      setToast({ message: "Selecione um cômodo", variant: "error" });
      return;
    }

    setLoading(true);
    editarDispositivo(editandoId, {
      nome: editandoNome,
      estado: editandoEstado,
      idComodo: editandoIdComodo,
    })
      .then(() => {
        setToast({
          message: "Dispositivo editado com sucesso!",
          variant: "success",
        });
        cancelarEdicao();
        refetchDispositivos();
      })
      .catch(() =>
        setToast({ message: "Erro ao editar dispositivo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExcluir(idDispositivo) {
    setLoading(true);
    excluirDispositivo(idDispositivo)
      .then(() => {
        setToast({
          message: "Dispositivo excluído com sucesso!",
          variant: "success",
        });
        refetchDispositivos();
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir dispositivo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleLigar(idDispositivo) {
    setLoading(true);
    ligarDispositivo(idDispositivo)
      .then(() => {
        setToast({ message: "Dispositivo ligado!", variant: "success" });
        refetchDispositivos();
      })
      .catch(() =>
        setToast({ message: "Erro ao ligar dispositivo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleDesligar(idDispositivo) {
    setLoading(true);
    desligarDispositivo(idDispositivo)
      .then(() => {
        setToast({ message: "Dispositivo desligado!", variant: "success" });
        refetchDispositivos();
      })
      .catch(() =>
        setToast({ message: "Erro ao desligar dispositivo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-wide">
          Lista de Dispositivos
        </h1>
        <p className="mt-2 text-slate-500">
          Gerencie os dispositivos da sua casa inteligente.
        </p>
      </div>

      <form
        onSubmit={handleCadastrar}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 p-6 border border-slate-200 rounded-lg"
      >
        <div className="sm:col-span-1">
          <label
            htmlFor="deviceName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Nome do Dispositivo
          </label>
          <input
            id="deviceName"
            type="text"
            placeholder="Ex: Lâmpada do Quarto"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="deviceRoom"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Cômodo
          </label>
          <div className="relative">
            <select
              id="deviceRoom"
              value={novoIdComodo}
              onChange={(e) => setNovoIdComodo(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione um cômodo</option>
              {comodos?.map((comodo) => (
                <option key={comodo.idComodo} value={comodo.idComodo}>
                  {comodo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2 flex items-center pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={novoEstado}
              onChange={(e) => setNovoEstado(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-700">
              Deixar o dispositivo ligado ao cadastrar?
            </span>
          </label>
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-center">
          <Button
            label="Cadastrar Dispositivo"
            variant="create"
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
          />
        </div>
      </form>

      {loading || loadingDispositivos || loadingComodos ? <Spinner /> : null}

      <ul className="space-y-4">
        {dispositivos?.map((dispositivo) => (
          <li
            key={dispositivo.idDispositivo}
            className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            {editandoId === dispositivo.idDispositivo ? (
              <div className="flex flex-grow flex-col sm:flex-row items-center gap-3 w-full">
                <input
                  type="text"
                  value={editandoNome}
                  onChange={(e) => setEditandoNome(e.target.value)}
                  className="flex-grow w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  autoFocus
                />

                <select
                  value={editandoIdComodo}
                  onChange={(e) => setEditandoIdComodo(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">Selecione um cômodo</option>
                  {comodos?.map((comodo) => (
                    <option key={comodo.idComodo} value={comodo.idComodo}>
                      {comodo.nome}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <Button
                    label="Salvar"
                    onClick={salvarEdicao}
                    variant="edit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  />
                  <Button
                    label="Cancelar"
                    onClick={cancelarEdicao}
                    variant="delete"
                    className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 flex-grow mb-4 sm:mb-0">
                  <div className="p-2 bg-white rounded-md">
                    <img
                      src="https://img.icons8.com/?size=100&id=SI2Oh5Hx5gz3&format=png&color=000000"
                      alt="Ícone Dispositivo"
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <span className="text-xl text-gray-800 font-semibold">
                      {dispositivo.nome}
                    </span>
                    <div
                      className={`mt-1 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full ${
                        dispositivo.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 mr-1 rounded-full ${
                          dispositivo.estado ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {dispositivo.estado ? "Ligado" : "Desligado"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() =>
                      dispositivo.estado
                        ? handleDesligar(dispositivo.idDispositivo)
                        : handleLigar(dispositivo.idDispositivo)
                    }
                    className={`p-2 rounded-full transition-all duration-200 ${
                      dispositivo.estado
                        ? "text-red-600 hover:bg-red-100"
                        : "text-green-600 hover:bg-green-100"
                    }`}
                    title={
                      dispositivo.estado
                        ? "Desligar dispositivo"
                        : "Ligar dispositivo"
                    }
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
                    onClick={() => iniciarEdicao(dispositivo)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                    title="Editar dispositivo"
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
                    onClick={() => handleExcluir(dispositivo.idDispositivo)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                    title="Excluir dispositivo"
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
              </>
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
