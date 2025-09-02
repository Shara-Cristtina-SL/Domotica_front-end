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
    refetch: refetchDispositivos, //para atualizar lista
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

  function handleCadastrar() {
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Dispositivos</h1>

      {/* Formulário de cadastro */}
      <div className="flex flex-col mb-4 space-y-2">
        <input
          type="text"
          placeholder="Nome do dispositivo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />

        <select
          value={novoIdComodo}
          onChange={(e) => setNovoIdComodo(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Selecione um cômodo</option>
          {comodos?.map((comodo) => (
            <option key={comodo.idComodo} value={comodo.idComodo}>
              {comodo.nome}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={novoEstado}
            onChange={(e) => setNovoEstado(e.target.checked)}
          />
          <span>Estado inicial ligado?</span>
        </label>

        <Button label="Cadastrar" onClick={handleCadastrar} variant="create" />
      </div>

      {loading || loadingDispositivos || loadingComodos ? <Spinner /> : null}

      {/* Lista de dispositivos */}
      <ul>
        {dispositivos?.map((dispositivo) => (
          <li
            key={dispositivo.idDispositivo}
            className="mb-2 flex flex-col space-y-2 border p-3 rounded"
          >
            {editandoId === dispositivo.idDispositivo ? (
              <>
                <input
                  type="text"
                  value={editandoNome}
                  onChange={(e) => setEditandoNome(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />

                <select
                  value={editandoIdComodo}
                  onChange={(e) => setEditandoIdComodo(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Selecione um cômodo</option>
                  {comodos?.map((comodo) => (
                    <option key={comodo.idComodo} value={comodo.idComodo}>
                      {comodo.nome}
                    </option>
                  ))}
                </select>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editandoEstado}
                    onChange={(e) => setEditandoEstado(e.target.checked)}
                  />
                  <span>Ligado?</span>
                </label>

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
                  <span className="font-semibold">{dispositivo.nome}</span>
                  <div>
                    <Button
                      label="Editar"
                      onClick={() => iniciarEdicao(dispositivo)}
                      variant="edit"
                    />
                    <Button
                      label="Excluir"
                      onClick={() => handleExcluir(dispositivo.idDispositivo)}
                      variant="delete"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>
                    Estado:{" "}
                    {dispositivo.estado ? (
                      <strong className="text-green-600">Ligado</strong>
                    ) : (
                      <strong className="text-red-600">Desligado</strong>
                    )}
                  </span>

                  {dispositivo.estado ? (
                    <Button
                      label="Desligar"
                      onClick={() => handleDesligar(dispositivo.idDispositivo)}
                      variant="default"
                    />
                  ) : (
                    <Button
                      label="Ligar"
                      onClick={() => handleLigar(dispositivo.idDispositivo)}
                      variant="default"
                    />
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Toast */}
      <Toast
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ message: "", variant: "success" })}
      />
    </div>
  );
}
