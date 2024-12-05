// "@/hooks/useReservation"

export const metrics = [
  { label: "Arrivals", value: 26, key: "arrivals" },
  { label: "Departures", value: 12, key: "departures", highlight: true },
  { label: "Check-in", value: 37, key: "check_in" },
  { label: "Bookings", value: 8, key: "bookings" },
  { label: "Cancellations", value: 6, key: "cancellations" },
];

export const fetchReservationByHotelId = async (hotelId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/reservations/by-hotel/${hotelId}`,
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

export const fetchActivityOptions = async (token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/reservations/activity-options`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch activity options.");
    }

    const data = await response.json();

    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching activities.");
  }
};

export const activityColors = {
  ["Arrival"]: { barColor: "#4caf50", backColor: "#a5d6a7" }, // Green for Arrival
  ["Check-in"]: { barColor: "#1976d2", backColor: "#90caf9" }, // Blue for Check-in
  ["Check-out"]: { barColor: "#ff5722", backColor: "#ffccbc" }, // Orange for Check-out
  ["Due-out"]: { barColor: "#9e9e9e", backColor: "#e0e0e0" }, // Gray for Due-out
  ["Bookings"]: { barColor: "#673ab7", backColor: "#d1c4e9" }, // Purple for Booking
  ["Cancelled"]: { barColor: "#f44336", backColor: "#ffcdd2" }, // Red for Cancelled
};

// Format the date into a proper ISO 8601 string for the scheduler
export const formatDateForEvent = (dateString) => {
  const [month, day, year] = dateString.split("/");

  // Ensure month and day have leading zeros if needed
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");

  // Return the date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
  return `${year}-${paddedMonth}-${paddedDay}`; // Adjust time as necessary
};

export const hotelBookings = async (hotelId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/reservations/by-hotel/${hotelId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room setup data.");
    }

    const data = await response.json();

    const formattedReservations = data.map((reservation) => {
      const activityType = reservation.activity;
      const colors = activityColors[activityType] || {
        barColor: "#000",
        barBackColor: "#fff",
      }; // Default colors if no match

      return {
        id: parseInt(reservation.id),
        text: `${reservation.name} - ${reservation.room} Room`,
        start: formatDateForEvent(reservation.dates.split(" - ")[0]), // Start date
        end: formatDateForEvent(reservation.dates.split(" - ")[1]), // End date
        resource: reservation.room,
        ...colors, // Spread the color properties
      };
    });

    // Ensure that data is always an array
    return Array.isArray(formattedReservations) ? formattedReservations : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchhotelRooms = async (hotelId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/rooms/hotels/${hotelId}`,
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
