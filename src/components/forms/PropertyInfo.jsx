import { Form, Input, Button } from "antd";
import useFormProcessor from "../../hooks/useFormProcessor";

const PropertyInfo = () => {
  const { formState, handleChange, resetForm } = useFormProcessor({
    name: "",
    location: "",
  });

  const handleSubmit = () => {
    console.log("Form Submitted:", formState);
    resetForm();
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Property Name">
        <Input name="name" value={formState.name} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Location">
        <Input
          name="location"
          value={formState.location}
          onChange={handleChange}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default PropertyInfo;
