import { useState } from "react";
import {
  listarAcoesCena,
  cadastrarAcaoCena,
  editarAcaoCena,
  excluirAcaoCena,
  executarAcaoCena,
} from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function AcoesList() {
  const { data: acoes, loading, error } = usePolling(listarAcoesCena, 3000);

  const [cenaId, setCenaId] = useState("");
  const [dispositivoId, setDispositivoId] = useState("");
  const [acao, setAcao] = useState("ligar");

  async function handleAdd() {
    if (!cenaId || !dispositivoId) return alert("Preencha os campos obrigatórios");
    try {
      await cadastrarAcaoCena({
        nome: `Acao ${Date.now()}`,
        idCena: Number(cenaId),
        dispositivos: [Number(dispositivoId)],
        grupos: [],
        acao,
      });
      setCenaId("");
      setDispositivoId("");
      setAcao("ligar");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading && !acoes) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <Card className="p-4">
      <h2>Ações de Cena</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Cena ID"
          value={cenaId}
          onChange={(e) => setCenaId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Dispositivo ID"
          value={dispositivoId}
          onChange={(e) => setDispositivoId(e.target.value)}
        />
        <select value={acao} onChange={(e) => setAcao(e.target.value)}>
          <option value="ligar">Ligar</option>
          <option value="desligar">Desligar</option>
        </select>
        <Button onClick={handleAdd} color="green">
          Adicionar
        </Button>
      </div>

      <ul>
        {acoes?.map((a) => (
          <li key={a.id} className="mb-3">
            <strong>{a.nome}</strong>
            <div className="flex gap-2 mt-1">
              <Button onClick={() => executarAcaoCena(a.id)} color="blue">
                Executar
              </Button>
              <Button
                onClick={() => {
                  const novaAcao = prompt("Nova ação (ligar/desligar):", a.acao);
                  if (novaAcao) editarAcaoCena(a.id, { ...a, acao: novaAcao });
                }}
                color="green"
              >
                Editar
              </Button>
              <Button onClick={() => excluirAcaoCena(a.id)} color="red">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {acoes?.length === 0 && !loading && <p>Nenhuma ação cadastrada.</p>}
    </Card>
  );
}
