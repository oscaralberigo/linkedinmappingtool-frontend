import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useEmployeeCountRange() {
  const [range, setRange] = useState<{ min: number; max: number } | null>(null);
  const [sizeRange, setSizeRange] = useState<[number, number]>([166, 228522]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRange = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiService.getEmployeeCountRange();
        setRange(result);
        setSizeRange([result.min, result.max]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employee count range';
        setError(errorMessage);
        console.error('Error fetching employee count range:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRange();
  }, []);

  return { range, loading, error, sizeRange, setSizeRange };
} 