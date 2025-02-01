export const validateReservationForm = (formData) => {
  const errors = [];

  // Validate stayInformation
  const { reservationDetails } = formData;
  // if (!reservationDetails.checkInDate)
  //   errors.push("Check-In date is required.");
  // if (!reservationDetails.checkOutDate)
  //   errors.push("Check-Out date is required.");
  // if (!reservationDetails.reservationType)
  //   errors.push("Reservation type is required.");

  if (!reservationDetails.rooms || reservationDetails.rooms.length === 0) {
    errors.push("At least one room must be selected.");
  } else {
    reservationDetails.rooms.forEach((room, index) => {
      ["roomName", "numberOfAdults", "roomPrice"].forEach((field) => {
        switch (field) {
          case "roomName":
            if (!room.roomName)
              errors.push(`Room ${index + 1}: Room name is required.`);
            break;

          case "numberOfAdults":
            if (room.numberOfAdults < 1)
              errors.push(`Room ${index + 1}: At least one adult is required.`);
            break;
          default:
            break;
        }
      });
    });
  }

  // Validate guestDetails
  const { guestDetails } = formData;
  console.log("guestDetails", guestDetails);
  if (!guestDetails || guestDetails.length === 0) {
    errors.push("At least one guest must be added.");
  } else {
    guestDetails.forEach((guest, index) => {
      [
        "fullName",
        "phone",
        "email",
        "gender",
        "address",
        "country",
        "state",
        "city",
        "zip",
        "idProof",
        "identityType",
        "identityNumber",
        "nationality",
      ].forEach((field) => {
        switch (field) {
          case "fullName":
            if (!guest.fullName)
              errors.push(`Guest ${index + 1}: Guest name is required.`);
            break;
          case "gender":
            if (!guest.gender)
              errors.push(`Guest ${index + 1}: Guest gender is required.`);
            break;
          case "phone":
            if (!guest.phone)
              errors.push(`Guest ${index + 1}: phone number is required.`);
            break;
          case "email":
            if (!guest.email)
              errors.push(`Guest ${index + 1}: Email is required.`);
            break;
          case "address":
            if (!guest.address)
              errors.push(`Guest ${index + 1}: Address is required.`);
            break;

          case "identityType":
            if (guest.idProof && !guest.identityType)
              errors.push(`Guest ${index + 1}: Identity type is required.`);
            break;
          case "identityNumber":
            if (guest.idProof && !guest.identityNumber)
              errors.push(`Guest ${index + 1}: Identity number is required.`);
            break;
          case "nationality":
            if (guest.idProof && !guest.nationality)
              errors.push(`Guest ${index + 1}: Nationality is required.`);
            break;
          default:
            break;
        }
      });
    });
  }

  // Validate billing
  const { billingDetails } = formData;
  ["payment_method", "billTo"].forEach((field) => {
    switch (field) {
      case "payment_method":
        if (!billingDetails.payment_method)
          errors.push("Payment mode is required.");
        break;
      case "billTo":
        if (!billingDetails.billTo)
          errors.push("Billing recipient is required.");
        break;
      default:
        break;
    }
  });

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
