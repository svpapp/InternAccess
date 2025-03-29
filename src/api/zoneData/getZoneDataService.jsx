import instance from '../auth/AxiosInstance';

const fetchZoneData = async () => {
  try {
    const response = await instance.get(
      '/api/v1/zoneArea/testAreaRouter/get-zone-json?zone=CAPITAL ZONE',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching zone data:', error);
    throw error;
  }
};

export default fetchZoneData;
