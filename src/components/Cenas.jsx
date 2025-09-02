import React, { useState } from "react";
import {
  listarCenas,
  cadastrarCena,
  editarCena,
  excluirCena,
  ligarCena,
  desligarCena,
} from "../api/cenas";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";
import { usePolling } from "../hooks/usePolling";

export default function Cenas() {
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  const {
    data: cenas,
    error,
    loading: loadingCenas,
    refetch: refetchCenas,
  } = usePolling(listarCenas, 5000);

  if (error) {
    setToast({ message: "Erro ao carregar cenas", variant: "error" });
  }

  function handleCadastrar(e) {
    e.preventDefault();
    if (!novoNome.trim()) {
      setToast({ message: "Informe o nome da cena", variant: "error" });
      return;
    }

    setLoading(true);
    cadastrarCena({ nome: novoNome, descricao: "" })
      .then(() => {
        setToast({
          message: "Cena cadastrada com sucesso!",
          variant: "success",
        });
        setNovoNome("");
        refetchCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao cadastrar cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function iniciarEdicao(cena) {
    setEditandoId(cena.idCena);
    setEditandoNome(cena.nome);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditandoNome("");
  }

  function salvarEdicao() {
    if (!editandoNome.trim()) {
      setToast({ message: "Informe o nome da cena", variant: "error" });
      return;
    }

    setLoading(true);
    editarCena(editandoId, { nome: editandoNome, descricao: "" })
      .then(() => {
        setToast({ message: "Cena editada com sucesso!", variant: "success" });
        cancelarEdicao();
        refetchCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao editar cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExcluir(idCena) {
    setLoading(true);
    excluirCena(idCena)
      .then(() => {
        setToast({ message: "Cena excluída com sucesso!", variant: "success" });
        refetchCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleLigar(idCena) {
    setLoading(true);
    ligarCena(idCena)
      .then(() => {
        setToast({ message: "Cena ativada!", variant: "success" });
        refetchCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao ativar cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleDesligar(idCena) {
    setLoading(true);
    desligarCena(idCena)
      .then(() => {
        setToast({ message: "Cena desativada!", variant: "success" });
        refetchCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao desativar cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-wide">
          Lista de Cenas
        </h1>
        <p className="mt-2 text-slate-500">
          Gerencie as cenas de automação da sua casa.
        </p>
      </div>

      <form
        onSubmit={handleCadastrar}
        className="flex flex-col sm:flex-row mb-8 space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <input
          type="text"
          placeholder="Adicionar nova cena"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="flex-grow px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
        <Button
          label="Cadastrar"
          variant="create"
          type="submit"
          className="px-6 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
      </form>

      {loading || loadingCenas ? <Spinner /> : null}

      <ul className="space-y-4">
        {cenas && cenas.length > 0 ? (
          cenas.map((cena) => (
            <li
              key={cena.idCena}
              className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              {editandoId === cena.idCena ? (
                <div className="flex flex-grow flex-col sm:flex-row items-center gap-3 w-full">
                  <input
                    type="text"
                    value={editandoNome}
                    onChange={(e) => setEditandoNome(e.target.value)}
                    className="flex-grow w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    autoFocus
                  />
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
                        src="https://img.icons8.com/?size=100&id=rHHQIIYQ2EwN&format=png&color=000000"
                        alt="Ícone Cena"
                        className="w-10 h-10"
                      />
                    </div>
                    <div>
                      <span className="text-xl text-gray-800 font-semibold">
                        {cena.nome}
                      </span>
                      <div
                        className={`mt-1 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full ${
                          cena.ativa
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 mr-1 rounded-full ${
                            cena.ativa ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {cena.ativa ? "Ativa" : "Inativa"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() =>
                        cena.ativa
                          ? handleDesligar(cena.idCena)
                          : handleLigar(cena.idCena)
                      }
                      className={`p-2 rounded-full transition-all duration-200 ${
                        cena.ativa
                          ? "text-red-600 hover:bg-red-100"
                          : "text-green-600 hover:bg-green-100"
                      }`}
                      title={cena.ativa ? "Desativar cena" : "Ativar cena"}
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
                      onClick={() => iniciarEdicao(cena)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                      title="Editar cena"
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
                      onClick={() => handleExcluir(cena.idCena)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                      title="Excluir cena"
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
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-medium text-slate-700">
              Nenhuma cena encontrada
            </h3>
            <p className="text-slate-500 mt-1">
              Comece adicionando uma nova cena no campo acima.
            </p>
          </div>
        )}
      </ul>

      <Toast
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ message: "", variant: "success" })}
      />
    </div>
  );
}
