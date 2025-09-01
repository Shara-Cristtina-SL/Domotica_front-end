import { useEffect, useState } from "react";

/**
 * @param {Function} fetchFn - função que retorna os dados da API (async).
 * @param {number} interval - tempo em ms entre cada requisição.
 */
export function usePolling(fetchFn, interval = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timer;

    const fetchData = async () => {
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
          setLoading(false); // só marca como carregado quando chegar o 1º resultado
        }
      } catch (err) {
        if (isMounted) setError(err);
      }
    };

    // primeira chamada imediata
    fetchData();

    // chamadas repetidas
    timer = setInterval(fetchData, interval);

    // cleanup
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [fetchFn, interval]);

  return { data, error, loading };
}
