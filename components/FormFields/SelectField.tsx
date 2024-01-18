import clsx from "clsx";
import dynamic from "next/dynamic";
import { ComponentProps, forwardRef, ReactNode, useId, useState } from "react";

interface Props extends Omit<ComponentProps<"select">, "prefix"> {
  label?: string;
  prefix?: string | ReactNode;
  className?: string;
  helper?: ReactNode;
  error?: boolean;
  options: any;
  onSelect?: any;
}
export const SelectField = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, prefix, error, className = "", options, helper, onSelect, ...props },
  ref
) {
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  return (
    <div className="mt-[10px]">
      <div className="mb-[3.5px]">{label}</div>
      <select
        className={`w-full px-2 py-2 bg-white border border-gray-300 outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400 ${
          className || ""
        }`}
        ref={ref}
        onChange={(e) => onSelect(e.target.value)}
        {...props}
      >
        {options.map((option: any, index: any) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
});

// const SelectField: React.FunctionComponent<SelectFieldProps> = ({
//   className,
//   label,
//   options,
//   ref,
//   ...props
// }) => {
//   console.log("first", props);
//   const [selectedAddress, setSelectedAddress] = useState<string>("");
//   return (
//     <>
//       <div>{label}</div>
//       <select
//         className={`w-full px-2 py-2 bg-white border border-gray-300 outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400 ${
//           className || ""
//         }`}
//         onChange={(e) => setSelectedAddress(e.target.value)}
//         {...props}
//       >
//         {options.map((address, index) => {
//           return (
//             <option key={index} value={address.value}>
//               {address.label}
//             </option>
//           );
//         })}
//       </select>
//     </>
//   );
// };

export default SelectField;
