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

  async function handleCadastrar() {
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Grupos</h1>

      {/* Formulário de cadastro */}
      <div className="flex flex-col mb-4 space-y-2">
        <input
          type="text"
          placeholder="Nome do grupo"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />

        <div className="max-h-48 overflow-auto border rounded p-2 mb-4">
          {dispositivos?.map((dispositivo) => (
            <label
              key={dispositivo.idDispositivo}
              className="flex items-center space-x-2"
            >
              <input
                type="checkbox"
                value={dispositivo.idDispositivo}
                checked={novoDispositivos.includes(dispositivo.idDispositivo)}
                onChange={(e) => {
                  const id = dispositivo.idDispositivo;
                  if (e.target.checked)
                    setNovoDispositivos([...novoDispositivos, id]);
                  else
                    setNovoDispositivos(
                      novoDispositivos.filter((i) => i !== id)
                    );
                }}
              />
              <span>{dispositivo.nome}</span>
            </label>
          ))}
        </div>

        <Button label="Cadastrar" onClick={handleCadastrar} variant="create" />
      </div>

      {loading || loadingGrupos || loadingDispositivos ? <Spinner /> : null}

      {/* Lista de grupos */}
      <ul>
        {grupos?.map((grupo) => (
          <li
            key={grupo.idGrupo}
            className="mb-2 flex flex-col space-y-2 border p-3 rounded"
          >
            {editandoId === grupo.idGrupo ? (
              <>
                <input
                  type="text"
                  value={editandoNome}
                  onChange={(e) => setEditandoNome(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />

                <div className="max-h-48 overflow-auto border rounded p-2 mb-4">
                  {dispositivos?.map((dispositivo) => (
                    <label
                      key={dispositivo.idDispositivo}
                      className="flex items-center space-x-2"
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
                      />
                      <span>{dispositivo.nome}</span>
                    </label>
                  ))}
                </div>

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
                  <span className="font-semibold">{grupo.nome}</span>
                  <div>
                    <Button
                      label="Editar"
                      onClick={() => iniciarEdicao(grupo)}
                      variant="edit"
                    />
                    <Button
                      label="Excluir"
                      onClick={() => handleExcluir(grupo.idGrupo)}
                      variant="delete"
                    />
                  </div>
                </div>

                <div>
                  <strong>Dispositivos:</strong>
                  <ul className="list-disc list-inside">
                    {grupo.dispositivos.length > 0 ? (
                      grupo.dispositivos.map((d) => (
                        <li key={d.idDispositivo}>{d.nome}</li>
                      ))
                    ) : (
                      <li>Nenhum dispositivo</li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Button
                    label="Ligar Grupo"
                    onClick={() => handleLigar(grupo.idGrupo)}
                    variant="default"
                  />
                  <Button
                    label="Desligar Grupo"
                    onClick={() => handleDesligar(grupo.idGrupo)}
                    variant="default"
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
