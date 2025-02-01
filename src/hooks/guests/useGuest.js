const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createGuest = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/guests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchAllGuest = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/guests/`, {
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

export const fetchGuestById = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
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

export const updateGuest = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteGuest = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete user");
};
