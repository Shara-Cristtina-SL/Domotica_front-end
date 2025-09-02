import { useEffect, useState, useCallback } from "react";

export function usePolling(fetchFn, interval = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    let timer;
    fetchData(); 
    timer = setInterval(fetchData, interval);

    return () => clearInterval(timer);
  }, [fetchData, interval]);

  return { data, error, loading, refetch: fetchData };
}
