import { useState } from "react";
import {
  listarGrupos,
  cadastrarGrupo,
  editarGrupo,
  excluirGrupo,
  ligarGrupo,
  desligarGrupo,
  listarDispositivos,
} from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function GruposList({ comodoId }) {
  const { data: grupos, loading, error } = usePolling(listarGrupos, 3000);
  const { data: dispositivos } = usePolling(listarDispositivos, 3000);

  const [nome, setNome] = useState("");
  const [selecionados, setSelecionados] = useState([]);

  async function handleAdd() {
    if (!nome || selecionados.length === 0) {
      alert("Informe o nome e pelo menos 1 dispositivo");
      return;
    }
    try {
      await cadastrarGrupo({
        nome,
        dispositivos: selecionados.map((id) => ({ idDispositivo: Number(id) })), // ✅ formato correto
      });
      setNome("");
      setSelecionados([]);
    } catch (err) {
      alert(err.message);
    }
  }

  const handleEditar = async (id, atual) => {
    const novoNome = prompt("Novo nome:", atual.nome);
    if (novoNome) {
      try {
        await editarGrupo(id, { ...atual, nome: novoNome });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExcluir = async (id) => {
    if (confirm("Excluir este grupo?")) {
      try {
        await excluirGrupo(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading && !grupos) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  // só dispositivos do cômodo atual
  const filtrados =
    dispositivos?.filter((d) => !comodoId || d.comodoId === comodoId) || [];

  return (
    <Card className="p-4">
      <h2>Grupos {loading && <span>⏳</span>}</h2>

      {/* Formulário cadastrar grupo */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Novo grupo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginRight: "8px" }}
        />

        <div style={{ margin: "10px 0" }}>
          <p>Selecione dispositivos:</p>
          <select
            multiple
            value={selecionados}
            onChange={(e) =>
              setSelecionados(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            style={{ width: "100%", minHeight: "80px" }}
          >
            {filtrados.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleAdd} color="green">
          Adicionar Grupo
        </Button>
      </div>

      <ul>
        {grupos?.map((g) => (
          <li key={g.id} style={{ marginBottom: "10px" }}>
            <strong>{g.nome}</strong>
            <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
              <Button onClick={() => ligarGrupo(g.id)} color="green">
                Ligar
              </Button>
              <Button onClick={() => desligarGrupo(g.id)} color="gray">
                Desligar
              </Button>
              <Button onClick={() => handleEditar(g.id, g)} color="blue">
                Editar
              </Button>
              <Button onClick={() => handleExcluir(g.id)} color="red">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {grupos?.length === 0 && !loading && <p>Nenhum grupo encontrado.</p>}
    </Card>
  );
}
