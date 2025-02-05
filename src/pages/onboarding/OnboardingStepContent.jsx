import PropertyInfo from "@/components/forms/onboarding/PropertyInfo";
import PropertyDetails from "@/components/forms/onboarding/PropertyDetails";
import RooomSetup from "@/components/forms/onboarding/RooomSetup";
const OnboardingStepContent = ({
  currentStep,
  // formData,
  handleFormChange,
  steps,
}) => {
  // Validate currentStep and steps array to avoid runtime errors
  if (!steps || currentStep < 0 || currentStep >= steps.length) {
    return <p>Error: Invalid step</p>;
  }

  const currentStepName = steps[currentStep]?.label;

  const renderStepContent = () => {
    switch (currentStepName) {
      case "Property Info":
        return (
          <PropertyInfo
            onChange={handleFormChange}
            // formData={formData.PropertyDetails}
          />
        );
      case "Property Details":
        return (
          <PropertyDetails
            onChange={handleFormChange}
            // formData={formData.PropertyDetails}
          />
        );
      case "Rooms Setup":
        return (
          <RooomSetup
            onChange={handleFormChange}
            // formData={formData.contactDetails}
          />
        );

      default:
        return <p>Step not found</p>;
    }
  };

  return <div>{renderStepContent()}</div>;
};

export default OnboardingStepContent;
