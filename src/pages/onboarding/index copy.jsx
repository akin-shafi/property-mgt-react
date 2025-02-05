import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Access AuthContext
import { toast } from "react-toastify";
import OnboardingStepContent from "./OnboardingStepContent";
import OnboardingTopNav from "@/components/onboarding/TopNav";
import AsideLeft from "@/components/onboarding/sideNav";
import Alert from "@/components/utils/Alert";
import validateStepData from "@/components/utils/validateStepData";
// import {Spin} from "antd";

export default function OnboardingLayout() {
  const [isSaving, setIsSaving] = useState(false); // Added isSaving state
  const { state } = useAuth();
  console.log(state);
  const { token } = state.token;
  const tenantId = state?.user?.tenantId;
  const username = state?.user?.firstName + " " + state?.user?.lastName;
  const router = useNavigate();
  const { step } = router.query;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  // Detect click outside of SideNav to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        closeSideNav();
      }
    };

    if (isSideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideNavOpen]);

  // Check for state and redirect if necessary
  useEffect(() => {
    if (status === "loading") return; // Avoid redirecting while loading

    // Redirect to login if the state or token is missing
    if (!state || !state.user?.token) {
      router.push("/auth/login");
    }
  }, [state, status, router]);

  const steps = [
    {
      label: "Property Info",
      message: "Add your property information accurately.",
      description:
        "Provide the property name, address, type, and contact details.",
    },
    {
      label: "Property Details",
      message: "Add your property information accurately.",
      description: "Provide the property type, policies, and description.",
    },
    {
      label: "Rooms Setup",
      message: "Configure your room details.",
      description:
        "Provide the room name, location, type, and available amenities.",
    },
  ];

  const stepEndpoints = ["property-info", "property-details", "rooms"];

  useEffect(() => {
    if (step) {
      const stepIndex = parseInt(step, 10) - 1;
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      }
    }
  }, [step]);

  const handleSaveAndNext = async () => {
    const stepName = stepEndpoints[currentStep];
    const endpoint = `${import.meta.env.VITE_BASE_URL}/${stepName}`;
    const camelCaseStepName = stepName
      .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
      .replace(/-/g, "");

    console.log("stepName", stepName);
    console.log("camelCaseStepName", camelCaseStepName);

    // Validate step data
    const { isValid, errors } = validateStepData(currentStep, formData);
    console.table("New formData", formData[camelCaseStepName]);
    // console.log(JSON.stringify(myObject, null, 2));

    // Handle validation errors
    if (!isValid) {
      setValidationErrors(errors);
      toast.error("Validation failed. Please check your input.");
      return;
    } else {
      setValidationErrors(""); // Clear previous validation errors
    }

    const stepData =
      formData[camelCaseStepName] || formData[stepName.replace(/-/g, "")];

    console.log("New formData", formData[camelCaseStepName]);

    try {
      setIsSaving(true);

      if (!token) {
        toast.error("User session is not available. Please log in again.");
      }

      let body;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        ...stepData,
        tenantId,
      });
      // }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.message || "An error occurred.");
        toast.error(errorData.message);
        setIsSaving(false);
        return; // Prevent submission
      }

      await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/users/update-onboarding-step`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            onboardingStep: currentStep + 1,
            tenantId: tenantId,
          }),
        }
      );

      if (currentStep === steps.length - 1) {
        toast.success("Onboarding complete! Redirecting...");
        router.push("/onboarding/congratulations");
      } else {
        toast.success("Step saved successfully!");
        handleNext();
      }

      setError(null);
      setValidationErrors(null);
    } catch (err) {
      console.error("Error saving data:", err);
      setError(err.message || "An error occurred.");
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    router.push(`/onboarding?step=${nextStep + 1}`, undefined, {
      shallow: true,
    });
    setCurrentStep(nextStep);
  };

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    router.push(`/onboarding?step=${prevStep + 1}`, undefined, {
      shallow: true,
    });
    setCurrentStep(prevStep);
  };

  // Handle form changes
  const handleFormChange = (data) => {
    const currentStepName = stepEndpoints[currentStep];
    const camelCaseStepName = currentStepName
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");

    setFormData((prev) => ({
      ...prev,
      [camelCaseStepName]: {
        ...prev[camelCaseStepName],
        ...data, // Merge new data with existing form data for this step
      },
    }));
  };

  return (
    <div className="w-screen h-screen flex md:flex-row flex-col bg-[#F7F9FC] overflow-hidden">
      <OnboardingTopNav onMenuClick={toggleSideNav} />
      <div className="flex w-full h-full">
        <AsideLeft
          isOpen={isSideNavOpen}
          onClose={toggleSideNav}
          ref={sideNavRef}
          steps={steps.map((step) => step.label)}
          stepMessages={steps.map((step) => step.message)}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <div className="flex-1 w-full h-[92vh] mt-[9vh] overflow-y-auto scroller bg-white">
          <div className="md:w-4/5 w-[90%] mx-auto">
            <div className="w-full my-5">
              <h4 className="md:text-[18px] text-[16px] font-medium my-3 capitalize">
                Welcome {username}
              </h4>

              <h5 className="md:text-[18px] text-[16px] font-medium text-[#101828]">
                {steps[currentStep]?.label}
              </h5>
              <p className="md:text-[14px] text-[12px] text-[#475467] font-azoSansRegular">
                {steps[currentStep]?.description}
              </p>
            </div>

            <OnboardingStepContent
              currentStep={currentStep}
              formData={formData}
              handleFormChange={handleFormChange}
              steps={steps}
            />
            {error && <Alert message={error} />}
            {validationErrors && <Alert message={validationErrors} />}
            <div className="flex justify-between  my-10">
              {/* <div> */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="w-full mr-5 bg-gray-300 px-4 py-2 rounded-full"
              >
                Previous
              </button>
              {/* </div> */}

              {/* <div> */}
              {[14].includes(currentStep) ? ( // Check if current step is Health and Disability
                <button
                  onClick={handleNext}
                  disabled={isSaving}
                  className="w-full bg-appOrange me-4 hover:bg-appOrangeLight transition duration-500 text-white border border-[#FFF] px-4 py-2 rounded-full"
                >
                  Save & Next
                </button>
              ) : (
                // w-full h-[44px] flex items-center justify-center gap-2 bg-appGreen hover:bg-appOrangeLight transition duration-500 text-white border border-[#FFF] rounded-[100px] md:text-[16px] text-[13px] font-semibold px-[12px]
                <button
                  onClick={handleSaveAndNext}
                  disabled={isSaving}
                  className="w-full bg-appOrange hover:bg-appOrangeLight transition duration-500 text-white border border-[#FFF] px-4 py-2 rounded-full"
                >
                  {isSaving
                    ? "Saving..."
                    : currentStep === steps.length - 1
                    ? "Submit"
                    : "Save & Next"}
                </button>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
