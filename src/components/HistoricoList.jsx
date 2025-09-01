import { listarHistorico } from "../api";
import { usePolling } from "../hooks/usePolling";

// UI
import Loader from "../UI/Loader";
import Alert from "../UI/Alert";
import Card from "../UI/Card";

export default function HistoricoList() {
  const { data: historico, loading, error } = usePolling(listarHistorico, 3000);

  if (loading && !historico) return <Loader />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <Card className="p-4">
      <h2>Histórico</h2>
      {loading && <span style={{ fontSize: "0.8em" }}>⏳ Atualizando...</span>}

      <table border="1" cellPadding="5" className="mt-3 w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ação</th>
            <th>Alvo</th>
            <th>Resultado</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {historico?.length > 0 ? (
            historico.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.acao}</td>
                <td>{h.alvo}</td>
                <td>{h.resultado}</td>
                <td>{new Date(h.dataHora).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum registro encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
