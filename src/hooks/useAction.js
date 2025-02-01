import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchCompleteRoomTypeDetailsByHotelId = async (hotelId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/room-type/hotels/${hotelId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch property data.");
    }

    const data = await response.json();

    // Ensure that policies is always an object
    data.policies = data.policies || {};

    return data;
  } catch (error) {
    throw new Error(error || "Error fetching property data.");
  }
};

export const fetchHotelDetailsByTenantId = async (tenantId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/property-details/tenant/${tenantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch property data.");
    }

    const data = await response.json();

    // Ensure that policies is always an object
    data.policies = data.policies || {};

    return data;
  } catch (error) {
    throw new Error(error || "Error fetching property data.");
  }
};

export const fetchAvailableRoomTypesByHotelId = async (hotelId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/room-type/${hotelId}/types`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchHotelRoomsByHotelId = async (hotelId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/hotels/${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room setup data.");
    }

    const data = await response.json();

    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchHotelRoomsWithPrice = async (hotelId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rooms/${hotelId}/with-prices`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room setup data.");
    }

    const data = await response.json();

    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchMaintenanceStatusOptions = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/maintenance-options`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch  data.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error || "Error fetching property data.");
  }
};

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createRoom = async (roomData, token) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room.");
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || "Error occurred while creating room.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, createRoom };
};

export const verifyDiscountCode = async (code, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/promotions/${code}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room setup data.");
    }

    const data = await response.json();

    // Ensure that data is always an array
    // return Array.isArray(data) ? data : [];
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};
