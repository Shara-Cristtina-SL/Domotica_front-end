import { useState } from "react";
import {
  listarDispositivos,
  cadastrarDispositivo,
  ligarDispositivo,
  desligarDispositivo,
  editarDispositivo,
  excluirDispositivo,
} from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function DispositivosList({ comodoId }) {
  const { data: dispositivos, loading, error } = usePolling(listarDispositivos, 3000);
  const [nome, setNome] = useState("");

  async function handleAdd() {
    if (!nome) return;
    try {
      await cadastrarDispositivo({ nome, idComodo: comodoId, estado: false });
      setNome("");
    } catch (err) {
      alert(err.message);
    }
  }

  const handleEditar = async (id, atual) => {
    const novoNome = prompt("Novo nome:", atual.nome);
    if (novoNome) {
      try {
        await editarDispositivo(id, { ...atual, nome: novoNome });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExcluir = async (id) => {
    if (confirm("Excluir este dispositivo?")) {
      try {
        await excluirDispositivo(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (error) return <Alert message={error.message} type="error" />;

  const filtrados = dispositivos?.filter((d) => d.idComodo === comodoId) || [];

  return (
    <Card className="p-3">
      <h4>
        Dispositivos{" "}
        {loading && <span style={{ fontSize: "0.8em" }}>⏳ Atualizando...</span>}
      </h4>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Novo dispositivo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button onClick={handleAdd} color="green">
          Adicionar
        </Button>
      </div>

      <ul>
        {filtrados.map((d) => (
          <li key={d.id}>
            {d.nome} ({d.estado ? "Ligado" : "Desligado"})
            <div className="flex gap-2 mt-1">
              <Button onClick={() => ligarDispositivo(d.id)}>Ligar</Button>
              <Button onClick={() => desligarDispositivo(d.id)} color="gray">
                Desligar
              </Button>
              <Button onClick={() => handleEditar(d.id, d)} color="green">
                Editar
              </Button>
              <Button onClick={() => handleExcluir(d.id)} color="red">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && !loading && <p>Nenhum dispositivo encontrado.</p>}
    </Card>
  );
}
