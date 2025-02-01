/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Form, Select, Input, Radio } from "antd";

const { Option } = Select;

const OtherInformation = ({ onChange }) => {
  const [otherInfo, setOtherInfo] = useState({
    identityType: null,
    identityNumber: "",
    nationality: null,
    gender: null,
  });

  useEffect(() => {
    if (onChange) {
      onChange("other", otherInfo);
    }
  }, [otherInfo]);

  const handleChange = (field, value) => {
    setOtherInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-3 space-y-4">
      <h3 className="text-lg font-medium">Other Informations</h3>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2 relative">
        <Form.Item
          label="Identity Type"
          rules={[
            { required: true, message: "Please select an identity type!" },
          ]}
        >
          <Select
            placeholder="Select Identity Type"
            value={otherInfo.identityType}
            onChange={(value) => handleChange("identityType", value)}
          >
            <Option value="passport">Passport</Option>
            <Option value="driving">Driving License</Option>
            <Option value="national">National ID</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Identity Number"
          rules={[
            { required: true, message: "Please enter your identity number!" },
          ]}
        >
          <Input
            placeholder="Enter Identity Number"
            value={otherInfo.identityNumber}
            onChange={(e) => handleChange("identityNumber", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Nationality"
          rules={[
            { required: true, message: "Please select your nationality!" },
          ]}
        >
          <Select
            placeholder="Select Nationality"
            value={otherInfo.nationality}
            onChange={(value) => handleChange("nationality", value)}
          >
            <Option value="us">American</Option>
            <Option value="uk">British</Option>
            <Option value="ca">Canadian</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Gender"
          rules={[{ required: true, message: "Please select your gender!" }]}
        >
          <Radio.Group
            value={otherInfo.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default OtherInformation;
