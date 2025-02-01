export const validateReservationForm = (formData) => {
  const errors = [];

  // Validate stayInformation
  const { stayInformation } = formData;
  if (!stayInformation.startDate) errors.push("Start date is required.");
  if (!stayInformation.endDate) errors.push("End date is required.");

  if (!stayInformation.rooms || stayInformation.rooms.length === 0) {
    errors.push("At least one room must be selected.");
  } else {
    stayInformation.rooms.forEach((room, index) => {
      if (!room.roomName)
        errors.push(`Room ${index + 1}: Room name is required.`);
      if (!room.roomId) errors.push(`Room ${index + 1}: Room ID is required.`);
      if (room.numberOfAdults < 1)
        errors.push(`Room ${index + 1}: At least one adult is required.`);
      if (room.roomPrice <= 0)
        errors.push(`Room ${index + 1}: Room price must be greater than 0.`);
    });
  }

  // Validate guests
  const { guests } = formData;
  if (!guests || guests.length === 0) {
    errors.push("At least one guest must be added.");
  } else {
    guests.forEach((guest, index) => {
      if (!guest.guestName)
        errors.push(`Guest ${index + 1}: Guest name is required.`);
      if (!guest.mobile)
        errors.push(`Guest ${index + 1}: Mobile number is required.`);
      if (!guest.email) errors.push(`Guest ${index + 1}: Email is required.`);
      if (!guest.address)
        errors.push(`Guest ${index + 1}: Address is required.`);
      if (!guest.country)
        errors.push(`Guest ${index + 1}: Country is required.`);
      if (!guest.state) errors.push(`Guest ${index + 1}: State is required.`);
      if (!guest.city) errors.push(`Guest ${index + 1}: City is required.`);
      if (!guest.zip) errors.push(`Guest ${index + 1}: Zip code is required.`);
      if (!guest.identityType)
        errors.push(`Guest ${index + 1}: Identity type is required.`);
      if (!guest.identityNumber)
        errors.push(`Guest ${index + 1}: Identity number is required.`);
      if (!guest.nationality)
        errors.push(`Guest ${index + 1}: Nationality is required.`);
    });
  }

  // Validate billing
  const { billing } = formData;
  if (!billing.paymentMode) errors.push("Payment mode is required.");
  if (!billing.billTo) errors.push("Billing recipient is required.");

  // Validate printOptions
  const { printOptions } = formData;
  if (
    !printOptions.printGuestCard &&
    !printOptions.printFolio &&
    !printOptions.printReceipt
  ) {
    errors.push("At least one print option must be selected.");
  }

  // Return errors
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false;
  }

  return true;
};
