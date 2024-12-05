// import React from "react";
import { Form, Select, Input, Radio } from "antd";

const { Option } = Select;

const OtherInformation = () => (
  <div>
    <Form.Item
      name="identityType"
      label="Identity Type"
      rules={[{ required: true, message: "Please select an identity type!" }]}
    >
      <Select placeholder="Select Identity Type">
        <Option value="passport">Passport</Option>
        <Option value="driving">Driving License</Option>
        <Option value="national">National ID</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="identityNumber"
      label="Identity Number"
      rules={[
        { required: true, message: "Please enter your identity number!" },
      ]}
    >
      <Input placeholder="Enter Identity Number" />
    </Form.Item>

    <Form.Item
      name="nationality"
      label="Nationality"
      rules={[{ required: true, message: "Please select your nationality!" }]}
    >
      <Select placeholder="Select Nationality">
        <Option value="us">American</Option>
        <Option value="uk">British</Option>
        <Option value="ca">Canadian</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="gender"
      label="Gender"
      rules={[{ required: true, message: "Please select your gender!" }]}
    >
      <Radio.Group>
        <Radio value="male">Male</Radio>
        <Radio value="female">Female</Radio>
      </Radio.Group>
    </Form.Item>
  </div>
);

export default OtherInformation;
