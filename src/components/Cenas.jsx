import React, { useEffect, useState } from "react";
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

export default function Cenas() {
  const [cenas, setCenas] = useState([]);

  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoNome, setEditandoNome] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", variant: "success" });

  useEffect(() => {
    carregarCenas();
  }, []);

  function carregarCenas() {
    setLoading(true);
    listarCenas()
      .then(setCenas)
      .catch(() =>
        setToast({ message: "Erro ao carregar cenas", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  function handleCadastrar() {
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
        carregarCenas();
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
        carregarCenas();
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
        carregarCenas();
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
        carregarCenas();
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
        carregarCenas();
      })
      .catch(() =>
        setToast({ message: "Erro ao desativar cena", variant: "error" })
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Cenas</h2>

      <div className="flex flex-col mb-4 space-y-2">
        <input
          type="text"
          placeholder="Nome da cena"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <Button label="Cadastrar" onClick={handleCadastrar} variant="create" />
      </div>

      {loading && <Spinner />}

      <ul>
        {cenas.map((cena) => (
          <li
            key={cena.idCena}
            className="mb-2 flex flex-col space-y-2 border p-3 rounded"
          >
            {editandoId === cena.idCena ? (
              <>
                <input
                  type="text"
                  value={editandoNome}
                  onChange={(e) => setEditandoNome(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />

                <div className="space-x-2">
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
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{cena.nome}</span>
                  <div>
                    <Button
                      label="Editar"
                      onClick={() => iniciarEdicao(cena)}
                      variant="edit"
                    />
                    <Button
                      label="Excluir"
                      onClick={() => handleExcluir(cena.idCena)}
                      variant="delete"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span>
                    Status:{" "}
                    {cena.ativa ? (
                      <strong className="text-green-600">Ativa</strong>
                    ) : (
                      <strong className="text-red-600">Inativa</strong>
                    )}
                  </span>

                  {cena.ativa ? (
                    <Button
                      label="Desativar"
                      onClick={() => handleDesligar(cena.idCena)}
                      variant="default"
                    />
                  ) : (
                    <Button
                      label="Ativar"
                      onClick={() => handleLigar(cena.idCena)}
                      variant="default"
                    />
                  )}
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
