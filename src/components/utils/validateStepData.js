// utils/validateStepData.js

const validateStepData = (currentStep, formData) => {
  const steps = [
    { label: "Property Info" },
    { label: "Property Details" },
  ];

  const currentStepData = steps[currentStep]; // Get the current step object
  let isValid = true;
  let errors = {};

  switch (currentStepData?.label) {
    case "Property Info":
      if (!formData.propertyInfo?.name) {
        errors.name = "Property name is required";
        isValid = false;
      }
      if (!formData.propertyInfo?.address) {
        errors.address = "Address is required";
        isValid = false;
      }
      if (!formData.propertyInfo?.city) {
        errors.city = "City is required";
        isValid = false;
      }
      if (!formData.propertyInfo?.country) {
        errors.country = "Country is required";
        isValid = false;
      }
      if (!formData.propertyInfo?.email) {
        errors.email = "Email is required";
        isValid = false;
      }
      if (!formData.propertyInfo?.phone) {
        errors.phone = "Phone is required";
        isValid = false;
      }
      break;

    case "Property Details":
      console.log("propertyInfo Data", formData.propertyDetails);

      // Validate Property Type
      if (!formData.propertyDetails?.propertyType) {
        errors.propertyType = "Property type is required";
        isValid = false;
      }

      // Validate cancellation and pet policies
      if (!formData.propertyDetails?.policies?.cancellation) {
        errors.policies = "Cancellation Policy is required";
        isValid = false;
      }

      if (!formData.propertyDetails?.policies?.pets) {
        errors.policies = "Pet Policy is required";
        isValid = false;
      }

      // Validate Amenities
      if (!formData.propertyDetails?.amenities) {
        errors.amenities = "Amenities are required";
        isValid = false;
      }

      break;

    default:
      break;
  }

  return { isValid, errors: Object.values(errors).join(", ") };
};

export default validateStepData;
