/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { Select, Checkbox, Spin } from "antd";
import Input from "antd/es/input/Input";
const { Option } = Select;
import { verifyDiscountCode } from "@/hooks/useAction";

const BillingInformation = ({ onChange, reservationData, token }) => {
  const [billingInfo, setBillingInfo] = useState({
    payment_method: null,
    billTo: null,
    amountPaid: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: null,
    totalPrice: reservationData?.totalPrice ?? 0,
    originalTotalPrice: reservationData?.totalPrice ?? 0,
    discountCode: "",
    discountType: "",
    discount: 0,
    isAddTax: false,
    promotionError: "",
    isDiscountLoading: false,
    grandTotal: reservationData?.totalPrice ?? 0,
    taxValue: 0, // Add taxValue to formState
    promotionType: "", // Add promotionType to formState
    promotionAmount: 0, // Add promotionAmount to formState
  });

  useEffect(() => {
    if (onChange) {
      onChange("billingDetails", {
        ...billingInfo,
        grandTotal: formState.grandTotal,
        isAddTax: formState.isAddTax, // Include tax status
        taxValue: formState.taxValue, // Include tax value
        promotionType: formState.promotionType, // Include promotion type
        promotionAmount: formState.promotionAmount, // Include promotion amount
      });
    }
  }, [
    billingInfo,
    formState.grandTotal,
    formState.isAddTax,
    formState.taxValue,
    formState.promotionType, // Track promotion type changes
    formState.promotionAmount, // Track promotion amount changes
  ]);

  const taxRate = 0.075; // 7.5%

  const addTax = () => {
    setFormState((prevState) => {
      const newStatus = !prevState.isAddTax;
      const newTaxValue = newStatus ? prevState.totalPrice * taxRate : 0;
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
        taxValue: newTaxValue, // Update tax value
      };
      onChange("billingDetails", {
        ...billingInfo,
        grandTotal: newGrandTotal,
        isAddTax: newStatus,
        taxValue: newTaxValue,
        promotionType: prevState.promotionType, // Include promotion type
        promotionAmount: prevState.promotionAmount, // Include promotion amount
      }); // Notify parent of state change
      return updatedState;
    });
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value;
    setFormState((prevState) => ({ ...prevState, discountCode: code }));
    onChange("billingDetails", { ...billingInfo, discountCode: code }); // Notify parent of state change

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
            promotionType: data.result.type, // Update promotion type
            promotionAmount: data.result.amount, // Update promotion amount
          };
          setFormState(updatedState);
          onChange("billingDetails", {
            ...billingInfo,
            grandTotal: updatedState.grandTotal,
            isAddTax: formState.isAddTax, // Include tax status
            taxValue: formState.taxValue, // Include tax value
            promotionType: updatedState.promotionType, // Include promotion type
            promotionAmount: updatedState.promotionAmount, // Include promotion amount
          }); // Notify parent of state change
          calculateTotalPrice(updatedState);
        } else {
          const updatedState = {
            ...formState,
            promotionError: data.message || "Promotion not found",
            discount: 0,
          };
          setFormState(updatedState);
          onChange("billingDetails", {
            ...billingInfo,
            grandTotal: updatedState.grandTotal,
            isAddTax: formState.isAddTax, // Include tax status
            taxValue: formState.taxValue, // Include tax value
            promotionType: updatedState.promotionType, // Include promotion type
            promotionAmount: updatedState.promotionAmount, // Include promotion amount
          }); // Notify parent of state change
        }
      } catch (err) {
        const updatedState = {
          ...formState,
          promotionError: err.message || "Promotion not found",
          discount: 0,
        };
        setFormState(updatedState);
        onChange("billingDetails", {
          ...billingInfo,
          grandTotal: updatedState.grandTotal,
          isAddTax: formState.isAddTax, // Include tax status
          taxValue: formState.taxValue, // Include tax value
          promotionType: updatedState.promotionType, // Include promotion type
          promotionAmount: updatedState.promotionAmount, // Include promotion amount
        }); // Notify parent of state change
      } finally {
        setFormState((prevState) => ({
          ...prevState,
          isDiscountLoading: false,
        }));
        onChange("billingDetails", {
          ...billingInfo,
          isDiscountLoading: false,
          isAddTax: formState.isAddTax, // Include tax status
          taxValue: formState.taxValue, // Include tax value
          promotionType: formState.promotionType, // Include promotion type
          promotionAmount: formState.promotionAmount, // Include promotion amount
        }); // Notify parent of state change
      }
    } else {
      setFormState((prevState) => ({ ...prevState, promotionError: "" }));
      onChange("billingDetails", {
        ...billingInfo,
        promotionError: "",
        isAddTax: formState.isAddTax,
        taxValue: formState.taxValue,
        promotionType: formState.promotionType, // Include promotion type
        promotionAmount: formState.promotionAmount, // Include promotion amount
      }); // Notify parent of state change
    }
  };

  const calculateTotalPrice = (state) => {
    const totalPrice = state.originalTotalPrice - state.discount;
    const grandTotal = state.isAddTax ? totalPrice * (1 + taxRate) : totalPrice;
    const taxValue = state.isAddTax ? totalPrice * taxRate : 0;
    setFormState((prevState) => ({
      ...prevState,
      totalPrice,
      grandTotal,
      taxValue,
    }));
    onChange("billingDetails", {
      ...billingInfo,
      totalPrice,
      grandTotal,
      isAddTax: state.isAddTax,
      taxValue,
      promotionType: state.promotionType, // Include promotion type
      promotionAmount: state.promotionAmount, // Include promotion amount
    }); // Notify parent of state change
  };

  useEffect(() => {
    if (reservationData?.totalPrice) {
      setFormState((prevState) => ({
        ...prevState,
        totalPrice: reservationData.totalPrice,
        originalTotalPrice: reservationData.totalPrice,
        grandTotal: reservationData.totalPrice,
        taxValue: 0, // Reset tax value
        promotionType: "", // Reset promotion type
        promotionAmount: 0, // Reset promotion amount
      }));
    }
  }, [reservationData?.totalPrice]);

  useEffect(() => {
    calculateTotalPrice(formState);
  }, [formState.originalTotalPrice, formState.discount, formState.isAddTax]);

  const handleAmountPaidChange = (e) => {
    const amountPaid = parseFloat(e.target.value) || 0;
    let balance = formState.grandTotal - amountPaid;
    let excess = 0;

    if (balance < 0) {
      excess = Math.abs(balance);
      balance = 0;
    }

    setBillingInfo((prev) => ({
      ...prev,
      amountPaid,
      balance,
      excess,
    }));
  };

  const handleChange = (field, value) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
      <div className="flex flex-col  border-b mb-2 ">
        <div className="flex justify-between">
          <span>Number of Nights:</span>{" "}
          <span>{reservationData?.numberOfNights}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Room Price/Night:</span>{" "}
          <span>{reservationData?.totalPrice?.toFixed(2) ?? "N/A"}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        {/* Amount Paid */}
        <div className="flex-1 mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <Input
            className="w-full"
            placeholder="Enter Amount Paid"
            value={billingInfo.amountPaid}
            onChange={handleAmountPaidChange}
            type="number"
          />
        </div>

        {/* Balance (Auto Calculated) */}
        <div className="flex-1 mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Balance
          </label>
          <Input
            className="w-full bg-gray-200"
            value={billingInfo.balance}
            disabled
          />
        </div>
      </div>

      {/* Hidden Excess Amount Field */}
      <input type="hidden" value={billingInfo.excess} />

      {/* Payment Mode */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <Select
          className="w-full"
          placeholder="Select Payment Method"
          value={billingInfo.payment_method}
          onChange={(value) => handleChange("payment_method", value)}
        >
          <Option value="cash">Cash</Option>
          <Option value="bank_transfer">Bank Transfer</Option>
          <Option value="pos_terminal">POS Terminal</Option>
          <Option value="others">Others</Option>
        </Select>
      </div>

      {/* Bill To */}
      <div className="mb-2">
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

      <div className="flex flex-col border-black p-4 mt-4 bg-blue-100 text-blue-800 font-bold rounded-md shadow-md">
        <div className="flex justify-between">
          <span>Grand Total:</span>
          <span>{formState.grandTotal?.toFixed(2) ?? "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
