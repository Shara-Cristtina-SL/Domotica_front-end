import React, { useEffect, useState } from "react";
import {
  listarComodos,
  cadastrarComodo,
  editarComodo,
  excluirComodo,
} from "../api/comodos";

import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { Toast } from "../ui/Toast";

export default function Comodos() {
  const [comodos, setComodos] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  useEffect(() => {
    carregarComodos();
  }, []);

  function carregarComodos() {
    setLoading(true);
    listarComodos()
      .then(setComodos)
      .catch(() =>
        setToast({ message: "Erro ao carregar cômodos", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleCadastrar() {
    if (!novoNome.trim()) return;

    setLoading(true);
    cadastrarComodo({ nome: novoNome })
      .then(() => {
        setToast({
          message: "Cômodo cadastrado com sucesso!",
          variant: "success",
        });
        setNovoNome("");
        carregarComodos();
      })
      .catch(() =>
        setToast({ message: "Erro ao cadastrar cômodo", variant: "error" })
      )
      .finally(() => setLoading(false));
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

    setLoading(true);
    editarComodo(editandoId, { nome: editandoNome })
      .then(() => {
        setToast({
          message: "Cômodo editado com sucesso!",
          variant: "success",
        });
        cancelarEdicao();
        carregarComodos();
      })
      .catch(() =>
        setToast({ message: "Erro ao editar cômodo", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleExcluir(id) {
    setLoading(true);
    excluirComodo(id)
      .then(() => {
        setToast({
          message: "Cômodo excluído com sucesso!",
          variant: "success",
        });
        carregarComodos();
      })
      .catch(() =>
        setToast({ message: "Erro ao excluir cômodo", variant: "error" })
      )
      .finally(() => setLoading(false));
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

      {loading && <Spinner />}

      <ul>
        {comodos.map((comodo) => (
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
                <Button label="Salvar" onClick={salvarEdicao} variant="edit" />
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
