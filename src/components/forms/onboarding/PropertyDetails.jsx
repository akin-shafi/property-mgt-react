import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Access AuthContext
// import { useSessionContext } from "@/context/SessionContext";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { fetchHotelDetailsByTenantId } from "../../../hooks/useAction";

const PropertyDetails = ({ onChange }) => {
  const { state } = useAuth();
  const token = state.token;
  const tenantId = state?.user?.tenantId;

  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);
  const [localFormData, setLocalFormData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      if (!token || !tenantId || hasFetchedData) return;

      setIsLoading(true);

      try {
        const fetchedData = await fetchHotelDetailsByTenantId(tenantId, token);
        console.log("fetchedData", fetchedData);

        setLocalFormData(fetchedData);
        onChange(fetchedData);
        setHasFetchedData(true);
        setIsLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch property data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, tenantId, hasFetchedData, onChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
    onChange(updatedFormData);
  };

  const handlePolicyChange = (e) => {
    const { name, value } = e.target;

    // Ensure policies is always an object
    const updatedPolicies = { ...localFormData.policies, [name]: value };

    // Update form data with the policies object
    const updatedFormData = { ...localFormData, policies: updatedPolicies };
    setLocalFormData(updatedFormData);
    onChange(updatedFormData);
  };

  const amenitiesOptions = [
    "Restaurant",
    "Laundry Service",
    "Bar",
    "Lounge",
    "Pool",
    "Gym",
    "Free Wi-Fi",
    "Event Center",
    "Meeting Rooms",
    "Others",
  ];

  const toggleAmenity = (amenity) => {
    const updatedAmenities = localFormData.amenities || [];
    const amenityIndex = updatedAmenities.indexOf(amenity);
    if (amenityIndex > -1) {
      updatedAmenities.splice(amenityIndex, 1);
    } else {
      updatedAmenities.push(amenity);
    }
    handleChange({ target: { name: "amenities", value: updatedAmenities } });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // const handleAmenitiesChange = (e) => {
  //   const { options } = e.target;
  //   const selectedOptions = [];
  //   for (const option of options) {
  //     if (option.selected) {
  //       selectedOptions.push(option.value);
  //     }
  //   }
  //   const updatedFormData = { ...localFormData, amenities: selectedOptions };
  //   setLocalFormData(updatedFormData);
  //   onChange(updatedFormData);
  // };

  return (
    <>
      {isMounted && (
        <CircleSpinnerOverlay
          loading={isLoading}
          overlayColor="rgba(0,153,255,0.2)"
        />
      )}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Property Type */}
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700"
            >
              Property Type <sup className="text-red-500">*</sup>
            </label>
            <select
              name="propertyType"
              value={localFormData?.propertyType || ""}
              onChange={handleChange}
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            >
              <option value="" disabled>
                Please Select
              </option>
              <option value="Hotels">Hotels</option>
              <option value="Resorts">Resorts</option>
              <option value="Hostels">Hostels</option>
              <option value="B&Bs">B&Bs</option>
              <option value="Serviced Apartments">Serviced Apartments</option>
              <option value="Guest houses">Guest houses</option>
              <option value="Chain of Properties">Chain of Properties</option>
              <option value="Vacation Rentals">Vacation Rentals</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Policies */}
          <div>
            <label
              htmlFor="cancellationPolicy"
              className="block text-sm font-medium text-gray-700"
            >
              Cancellation Policy <sup className="text-red-500">*</sup>
            </label>
            <select
              name="cancellation"
              value={localFormData?.policies?.cancellation || ""}
              onChange={handlePolicyChange}
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            >
              <option value="" disabled>
                Cancellation Policy
              </option>
              <option value="24 hours">24 hours</option>
              <option value="12 hours">12 hours</option>
            </select>

            <label
              htmlFor="petsPolicy"
              className="block text-sm font-medium text-gray-700"
            >
              Pets Policy <sup className="text-red-500">*</sup>
            </label>
            <select
              name="pets"
              value={localFormData?.policies?.pets || ""}
              onChange={handlePolicyChange}
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            >
              <option value="" disabled>
                Pets Policy
              </option>
              <option value="allowed">Allowed</option>
              <option value="Not allowed">Not allowed</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <h6 className="text-[14px] text-gray-900 font-medium">
              Please select all amenities you have{" "}
              <sup className="text-red-500">*</sup>
            </h6>
            {amenitiesOptions.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={localFormData.amenities?.includes(amenity) || false}
                  onChange={() => toggleAmenity(amenity)}
                  className="accent-appOrange"
                />
                <label htmlFor={amenity} className="text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <p className="text-sm font-azoSansRegular">
              If you select other kindly describe
            </p>
            <textarea
              name="description"
              value={localFormData?.description || ""}
              onChange={handleChange}
              placeholder="Describe the property here..."
              className="w-full p-2 border border-gray-300 rounded mt-1"
              rows={5}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
