/* eslint-disable react/prop-types */

export function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium md:text-[14px] text-[12px] text-[#344054] font-medium flex items-center gap-1"
    >
      {children}
    </label>
  );
}
