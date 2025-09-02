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
  } = usePolling(listarComodos, 5000);

  if (error) {
    setToast({ message: "Erro ao carregar cômodos", variant: "error" });
  }

  function handleCadastrar() {
    if (!novoNome.trim()) return;

    cadastrarComodo({ nome: novoNome })
      .then(() => {
        setToast({
          message: "Cômodo cadastrado com sucesso!",
          variant: "success",
        });
        setNovoNome("");
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
    if (!editandoNome.trim()) return;

    editarComodo(editandoId, { nome: editandoNome })
      .then(() => {
        setToast({
          message: "Cômodo editado com sucesso!",
          variant: "success",
        });
        cancelarEdicao();
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
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir cômodo", variant: "error" })
      );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Cômodos</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Novo cômodo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-md"
        />
        <Button label="Cadastrar" onClick={handleCadastrar} variant="create" />
      </div>

      {loadingPolling && <Spinner />}

      <ul>
        {comodos &&
          comodos.map((comodo) => (
            <li
              key={comodo.idComodo}
              className="mb-2 flex items-center justify-between"
            >
              {editandoId === comodo.idComodo ? (
                <>
                  <input
                    type="text"
                    value={editandoNome}
                    onChange={(e) => setEditandoNome(e.target.value)}
                    className="flex-grow px-3 py-2 border rounded-l-md"
                  />
                  <Button
                    label="Salvar"
                    onClick={salvarEdicao}
                    variant="edit"
                  />
                  <Button
                    label="Cancelar"
                    onClick={cancelarEdicao}
                    variant="default"
                  />
                </>
              ) : (
                <>
                  <span>{comodo.nome}</span>
                  <div className="space-x-2">
                    <Button
                      label="Editar"
                      onClick={() => iniciarEdicao(comodo)}
                      variant="edit"
                    />
                    <Button
                      label="Excluir"
                      onClick={() => handleExcluir(comodo.idComodo)}
                      variant="delete"
                    />
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
