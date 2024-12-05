import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "../../../context/AuthContext"; // Access AuthContext

import { CircleSpinnerOverlay } from "react-spinner-overlay";

const PropertyInfo = ({ onChange }) => {
  const { state } = useAuth();
  const token = state.token;
  const tenantId = state?.user?.tenantId;

  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [localFormData, setLocalFormData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);
  console.log("state", state);
  useEffect(() => {
    setIsMounted(true);

    const fetchPropertyData = async () => {
      if (!token || !tenantId || hasFetchedData) return;

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/property-details/tenant/${tenantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch contact data.");
        }
        const data = await response.json();
        setLocalFormData(data);
        onChange(data);
        setHasFetchedData(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [token, tenantId, hasFetchedData, onChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
    onChange(updatedFormData);
  };

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
          {/* Property Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Property Name <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="text"
              name="name"
              value={localFormData?.name || ""}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="text"
              name="address"
              value={localFormData?.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="text"
              name="city"
              value={localFormData?.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="text"
              name="country"
              value={localFormData?.country || ""}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone <sup className="text-red-500">*</sup>
            </label>
            <PhoneInput
              country={"gb"}
              value={localFormData?.phone}
              onChange={(value) =>
                handleChange({ target: { name: "phone", value } })
              }
              preferredCountries={["uk"]}
              buttonClass="h-full w-fit"
              enableSearch
              inputStyle={{
                width: "100%",
                height: "38px",
                borderRadius: "8px",
                color: "#667085",
                border: "1px solid #D0D5DD",
                fontWeight: "500",
              }}
              buttonStyle={{
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                border: "1px solid #D0D5DD",
              }}
              containerStyle={{
                borderRadius: "8px",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <sup className="text-red-500">*</sup>
            </label>
            <input
              required
              type="email"
              name="email"
              value={localFormData?.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 form-control border border-gray-300 rounded mt-1"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyInfo;
