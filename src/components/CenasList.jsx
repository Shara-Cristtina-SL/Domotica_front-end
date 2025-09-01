import { useState } from "react";
import {
  listarCenas,
  cadastrarCena,
  editarCena,
  excluirCena,
  ligarCena,
  desligarCena,
} from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function CenasList({ comodoId }) {
  const { data: cenas, loading, error } = usePolling(listarCenas, 3000);
  const [nome, setNome] = useState("");

  async function handleAdd() {
    if (!nome) return;
    try {
      await cadastrarCena({
        nome,
        descricao: "",
        comodoId, 
      });
      setNome("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading && !cenas) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  const filtradas = cenas?.filter((c) => c.comodoId === comodoId) || [];

  return (
    <Card className="p-4">
      <h2>Cenas</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Nova cena"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button onClick={handleAdd} color="green">
          Adicionar
        </Button>
      </div>

      <ul>
        {filtradas.map((c) => (
          <li key={c.idCena} className="mb-3">
            {c.nome}
            <div className="flex gap-2 mt-1">
              <Button onClick={() => ligarCena(c.idCena)} color="green">
                Ligar
              </Button>
              <Button onClick={() => desligarCena(c.idCena)} color="gray">
                Desligar
              </Button>
              <Button
                onClick={() => {
                  const novoNome = prompt("Novo nome:", c.nome);
                  if (novoNome) editarCena(c.idCena, { ...c, nome: novoNome });
                }}
                color="blue"
              >
                Editar
              </Button>
              <Button onClick={() => excluirCena(c.idCena)} color="red">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filtradas.length === 0 && !loading && (
        <p>Nenhuma cena encontrada.</p>
      )}
    </Card>
  );
}
