import ComodosList from "../components/ComodosList";
import HistoricoList from "../components/HistoricoList";
import Button from "../UI/Button";

export default function Home() {
  return (
    <div className="p-4">
      <h1>🏠 Casa Inteligente</h1>

      {/* Lista de Cômodos (com cadastrar, editar, excluir, detalhes) */}
      <ComodosList />

      {/* Acesso rápido ao histórico completo */}
      <div className="mt-6">
        <h2>Histórico Geral</h2>
        <Button onClick={() => window.location.href = "/historico"}>
          Ver histórico completo
        </Button>
        <HistoricoList />
      </div>
    </div>
  );
}
