/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { Select, Checkbox, Spin } from "antd";
import Input from "antd/es/input/Input";
const { Option } = Select;
import { verifyDiscountCode } from "@/hooks/useAction";

const BillingInformation = ({ onChange, reservationData, token }) => {
  console.log("reservationData", reservationData);

  const [billingInfo, setBillingInfo] = useState({
    paymentMode: null,
    billTo: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: null,
    totalPrice: reservationData?.totalPrice || 0,
    originalTotalPrice: reservationData?.totalPrice || 0,
    discountCode: "",
    discountType: "",
    discount: 0,
    isAddTax: false,
    promotionError: "",
    isDiscountLoading: false,
    grandTotal: reservationData?.totalPrice || 0,
  });

  useEffect(() => {
    if (onChange) {
      onChange("billing", billingInfo);
    }
  }, [billingInfo]);

  const taxRate = 0.075; // 7.5%

  const addTax = () => {
    setFormState((prevState) => {
      const newStatus = !prevState.isAddTax;
      const newTotalPrice = newStatus
        ? prevState.totalPrice * (1 + taxRate)
        : prevState.totalPrice / (1 + taxRate);
      const newGrandTotal = newStatus
        ? prevState.grandTotal * (1 + taxRate)
        : prevState.grandTotal / (1 + taxRate);
      const updatedState = {
        ...prevState,
        isAddTax: newStatus,
        totalPrice: newTotalPrice,
        grandTotal: newGrandTotal,
      };
      onChange("billing", updatedState); // Notify parent of state change
      return updatedState;
    });
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value;
    setFormState((prevState) => ({ ...prevState, discountCode: code }));
    onChange("billing", { ...formState, discountCode: code }); // Notify parent of state change

    if (code.length === 6) {
      setFormState((prevState) => ({ ...prevState, isDiscountLoading: true }));
      try {
        const data = await verifyDiscountCode(code, token);
        let discountValue = 0;
        if (data.status === 200) {
          if (data.result.type === "percentage") {
            discountValue =
              (formState.originalTotalPrice * data.result.amount) / 100;
          } else if (data.result.type === "value") {
            discountValue = data.result.amount;
          }
          const updatedState = {
            ...formState,
            discount: discountValue,
            discountType: data.result.type,
            promotionError: "",
          };
          setFormState(updatedState);
          onChange("billing", updatedState); // Notify parent of state change
          calculateTotalPrice(updatedState);
        } else {
          const updatedState = {
            ...formState,
            promotionError: data.message || "Promotion not found",
            discount: 0,
          };
          setFormState(updatedState);
          onChange("billing", updatedState); // Notify parent of state change
        }
      } catch (err) {
        const updatedState = {
          ...formState,
          promotionError: err.message || "Promotion not found",
          discount: 0,
        };
        setFormState(updatedState);
        onChange("billing", updatedState); // Notify parent of state change
      } finally {
        setFormState((prevState) => ({
          ...prevState,
          isDiscountLoading: false,
        }));
        onChange("billing", { ...formState, isDiscountLoading: false }); // Notify parent of state change
      }
    } else {
      setFormState((prevState) => ({ ...prevState, promotionError: "" }));
      onChange("billing", { ...formState, promotionError: "" }); // Notify parent of state change
    }
  };

  const calculateTotalPrice = (state) => {
    const totalPrice = state.originalTotalPrice - state.discount;
    const grandTotal = state.isAddTax ? totalPrice * (1 + taxRate) : totalPrice;
    setFormState((prevState) => ({
      ...prevState,
      totalPrice,
      grandTotal,
    }));
    onChange("billing", { ...state, totalPrice, grandTotal }); // Notify parent of state change
  };

  useEffect(() => {
    calculateTotalPrice(formState);
  }, [formState.originalTotalPrice, formState.discount, formState.isAddTax]);

  const handleChange = (field, value) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
      {/* Payment Mode */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Payment Mode
        </label>
        <Select
          className="w-full"
          placeholder="Select Payment Mode"
          value={billingInfo.paymentMode}
          onChange={(value) => handleChange("paymentMode", value)}
        >
          <Option value="cash">Cash</Option>
          <Option value="bank_transfer">Bank Transfer</Option>
          <Option value="pos">POS Terminal</Option>
          <Option value="others">Others</Option>
        </Select>
      </div>

      {/* Bill To */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Bill To
        </label>
        <Select
          className="w-full"
          placeholder="Select Bill To"
          value={billingInfo.billTo}
          onChange={(value) => handleChange("billTo", value)}
        >
          <Option value="guest">Guest</Option>
          <Option value="company">Company</Option>
          <Option value="agent">Agent</Option>
        </Select>
      </div>
      <div className="">
        <label
          htmlFor="discountCode"
          className="block text-sm font-medium text-gray-700"
        >
          Discount Code
        </label>
        <Input
          id="discountCode"
          value={formState.discountCode}
          onChange={handleDiscountCodeChange}
          maxLength={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={formState.isDiscountLoading}
          suffix={formState.isDiscountLoading && <Spin />}
        />
      </div>

      <div className="my-4">
        <label className="flex items-center space-x-2">
          <Checkbox checked={formState.isAddTax} onChange={addTax} />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Include VAT (7.5%)
          </span>
        </label>
      </div>

      {formState.discountType && (
        <div className="flex flex-col  border-black">
          <div className="flex justify-between p-2">
            <span>Discount Type:</span>
            <span>{formState.discountType}</span>
          </div>
          <div className="flex justify-between p-2">
            <span>Discount value:</span>
            <span>{formState.discount}</span>
          </div>
        </div>
      )}
      <div className="flex flex-col  border-black">
        <div className="flex justify-between p-2">
          <span>Number of Nights:</span>{" "}
          <span>{reservationData?.numberOfNights}</span>
        </div>
        <div className="flex justify-between p-2">
          <span>Total Room Price/Night:</span>{" "}
          <span>{reservationData?.totalPrice?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between p-2">
          <span>Grand Total:</span>
          <span>{formState.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
