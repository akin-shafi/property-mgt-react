import { useState } from "react";

const useFormProcessor = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => setFormState(initialState);

  return { formState, handleChange, resetForm };
};

export default useFormProcessor;
