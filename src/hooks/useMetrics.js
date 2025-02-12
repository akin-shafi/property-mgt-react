const API_BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

// http://localhost:8400/metrics/room-metrics?hotelId=10&startDate=2025-02-09&endDate=2025-02-15&status=available

// Hook to fetch room metrics
export const fetchRoomMetrics = async (
  token,
  hotelId,
  startDate,
  endDate,
  status
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/metrics/room-metrics?hotelId=${hotelId}&startDate=${startDate}&endDate=${endDate}&status=${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch room metrics data."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching room metrics data.");
  }
};

// Hook to fetch date-based metrics
export const fetchDateBasedMetrics = async (token, hotelId, date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/metrics/date-based-metrics?hotelId=${hotelId}&date=${date}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch date-based metrics data."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching date-based metrics data.");
  }
};

// Hook to fetch year-based metrics
export const fetchYearBasedMetrics = async (token, hotelId, year) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/metrics/year-based-metrics?hotelId=${hotelId}&year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch year-based metrics data."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching year-based metrics data.");
  }
};
