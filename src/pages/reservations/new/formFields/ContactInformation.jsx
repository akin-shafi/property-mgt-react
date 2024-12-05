"use client";
import { Card, Form, Input, Row, Col, Select } from "antd";

const ContactInformation = () => {
  // const [form] = Form.useForm();
  const { Option } = Select;
  return (
    <Card title="Contact Information">
      <main>
        <Form.Item label="Address" name="address">
          <Input.TextArea
            placeholder="Address"
            rows="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="State" name="state">
              <Input placeholder="State" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="ZIP Code" name="zipCode">
              <Input placeholder="ZIP Code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Country" name="country">
              <Select placeholder="Select Country">
                <Option value="us">United States</Option>
                <Option value="uk">United Kingdom</Option>
                <Option value="ca">Canada</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </main>
    </Card>
  );
};

export default ContactInformation;
