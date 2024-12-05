/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Select, Input, Checkbox, Button } from "antd";

const BillingInformation = ({ selectedRoomType }) => {
  const roomPrices = {
    studio: 16000,
    standard: 18000,
    deluxe: 20000,
    executive: 22000,
    junior_suite: 25000,
  };

  const [setRateType] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [setPaymentMode] = useState(null);
  const [setBillTo] = useState(null);
  const [taxExempt, setTaxExempt] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [selectedRoomType, discount, taxExempt]);

  const calculateTotal = () => {
    const roomPrice = roomPrices[selectedRoomType] || 0;
    const discountedPrice = roomPrice - (roomPrice * discount) / 100;
    const finalCost = taxExempt ? discountedPrice : discountedPrice * 1.15;
    setTotalCost(finalCost.toFixed(2));
  };

  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(value);
    calculateTotal();
  };

  const handleTaxExemptToggle = (e) => {
    setTaxExempt(e.target.checked);
    calculateTotal();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
      {/* Rate Type */}
      <div className="mb-4">
        <label
          htmlFor="rate-type"
          className="block text-sm font-medium text-gray-700"
        >
          Rate Type
        </label>
        <Select
          id="rate-type"
          className="w-full"
          placeholder="Select Rate Type"
          options={[
            { value: "flexible", label: "Flexible" },
            { value: "non_refundable", label: "Non-Refundable" },
            { value: "advance_purchase", label: "Advance Purchase" },
            { value: "corporate", label: "Corporate Rate" },
            { value: "promotional", label: "Promotional Rate" },
          ]}
          onChange={(value) => setRateType(value)}
        />
      </div>

      {/* Discount */}
      <div className="mb-4">
        <label
          htmlFor="discount"
          className="block text-sm font-medium text-gray-700"
        >
          Discount (%)
        </label>
        <Input
          id="discount"
          type="number"
          placeholder="Enter Discount"
          onChange={handleDiscountChange}
        />
      </div>

      {/* Payment Mode */}
      <div className="mb-4">
        <label
          htmlFor="payment-mode"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Mode
        </label>
        <Select
          id="payment-mode"
          className="w-full"
          placeholder="Select Payment Mode"
          options={[
            { value: "cash", label: "Cash" },
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "pos", label: "POS Terminal" },
            { value: "others", label: "Others" },
          ]}
          onChange={(value) => setPaymentMode(value)}
        />
      </div>

      {/* Bill To */}
      <div className="mb-4">
        <label
          htmlFor="bill-to"
          className="block text-sm font-medium text-gray-700"
        >
          Bill To
        </label>
        <Select
          id="bill-to"
          className="w-full"
          placeholder="Select Bill To"
          options={[
            { value: "guest", label: "Guest" },
            { value: "company", label: "Company" },
            { value: "agent", label: "Agent" },
          ]}
          onChange={(value) => setBillTo(value)}
        />
      </div>

      {/* Tax Exemption */}
      <div className="mb-4 flex items-center">
        <Checkbox onChange={handleTaxExemptToggle} />
        <label className="ml-2 text-sm font-medium text-gray-700">
          Tax Exemption
        </label>
      </div>

      {/* Total Cost */}
      <div className="mb-4">
        <label
          htmlFor="total-cost"
          className="block text-sm font-medium text-gray-700"
        >
          Total Cost
        </label>
        <Input
          id="total-cost"
          value={`₦${totalCost}`}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* Submit */}
      <Button type="primary" onClick={calculateTotal}>
        Calculate Total
      </Button>
    </div>
  );
};

export default BillingInformation;
