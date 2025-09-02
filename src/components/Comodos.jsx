import React, { useState } from "react";
import {
  listarComodos,
  cadastrarComodo,
  editarComodo,
  excluirComodo,
} from "../api/comodos";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";
import { usePolling } from "../hooks/usePolling";

export default function Comodos() {
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [toast, setToast] = useState({ message: "", variant: "success" });

  const {
    data: comodos,
    error,
    loading: loadingPolling,
    refetch,
  } = usePolling(listarComodos, 5000);

  if (error) {
    setToast({ message: "Erro ao carregar cômodos", variant: "error" });
  }

  function handleCadastrar(e) {
    e.preventDefault();
    if (!novoNome.trim()) {
      setToast({
        message: "Nome do cômodo não pode ser vazio",
        variant: "error",
      });
      return;
    }

    cadastrarComodo({ nome: novoNome })
      .then(() => {
        setToast({
          message: "Cômodo cadastrado com sucesso!",
          variant: "success",
        });
        setNovoNome("");
        refetch();
      })
      .catch(() =>
        setToast({ message: "Erro ao cadastrar cômodo", variant: "error" })
      );
  }

  function iniciarEdicao(comodo) {
    setEditandoId(comodo.idComodo);
    setEditandoNome(comodo.nome);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditandoNome("");
  }

  function salvarEdicao() {
    if (!editandoNome.trim()) {
      setToast({
        message: "Nome do cômodo não pode ser vazio",
        variant: "error",
      });
      return;
    }

    editarComodo(editandoId, { nome: editandoNome })
      .then(() => {
        setToast({
          message: "Cômodo editado com sucesso!",
          variant: "success",
        });
        cancelarEdicao();
        refetch();
      })
      .catch(() =>
        setToast({ message: "Erro ao editar cômodo", variant: "error" })
      );
  }

  function handleExcluir(id) {
    excluirComodo(id)
      .then(() => {
        setToast({
          message: "Cômodo excluído com sucesso!",
          variant: "success",
        });
        refetch();
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir cômodo", variant: "error" })
      );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl ">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-wide">
          Lista de Cômodos
        </h1>
        <p className="mt-2 text-slate-500">
          Adicione, edite ou remova os cômodos da sua casa.
        </p>
      </div>

      <form
        onSubmit={handleCadastrar}
        className="flex flex-col sm:flex-row mb-8 space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <input
          type="text"
          placeholder="Adicionar novo cômodo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="flex-grow px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
        <Button
          label="Cadastrar"
          onClick={handleCadastrar}
          variant="create"
          type="submit"
          className="px-6 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
      </form>

      {loadingPolling && <Spinner />}

      <ul className="space-y-6">
        {comodos && comodos.length > 0 ? (
          comodos.map((comodo) => (
            <li
              key={comodo.idComodo}
              className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <img
                  src="https://img.icons8.com/?size=100&id=ZWYJICldxSRY&format=png&color=000000"
                  alt="Ícone Cômodo"
                  className="w-10 h-10"
                />
                <span className="text-2xl text-gray-800 font-semibold">
                  {comodo.nome}
                </span>
              </div>

              {editandoId === comodo.idComodo ? (
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-4 sm:space-y-0 w-full">
                  <input
                    type="text"
                    value={editandoNome}
                    onChange={(e) => setEditandoNome(e.target.value)}
                    className="px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto transition-all duration-300"
                    autoFocus
                  />
                  <div className="flex space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                    <Button
                      label="Salvar"
                      onClick={salvarEdicao}
                      variant="edit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                    <Button
                      label="Cancelar"
                      onClick={cancelarEdicao}
                      variant="delete"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => iniciarEdicao(comodo)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                    title="Editar cômodo"
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleExcluir(comodo.idComodo)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-200 rounded-full transition-all duration-200"
                    title="Excluir cômodo"
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
              )}
            </li>
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-medium text-slate-700">
              Nenhum cômodo encontrado
            </h3>
            <p className="text-slate-500 mt-1">
              Comece adicionando um novo cômodo no campo acima.
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
