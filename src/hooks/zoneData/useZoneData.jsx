import {useState, useEffect} from 'react';
import fetchZoneData from '../../api/zoneData/getZoneDataService';

const useZoneData = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZoneData();
        setZones(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, []);

  return {zones, loading, error};
};

export default useZoneData;
