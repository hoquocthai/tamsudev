import React, { ChangeEvent } from "react";

interface CheckBoxProps {
  name: string;
  id?: number;
  onChange: (value: boolean) => void;
}

const CheckBox: React.FunctionComponent<CheckBoxProps> = ({
  name,
  id,
  onChange,
}) => {
  const onChangeCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onChange(checked);
  };
  return (
    <>
      <div className="flex items-center mb-4">
        <input
          id={name}
          type="checkbox"
          value={name}
          className="w-4 h-4 rounded"
          onChange={onChangeCheckBox}
        />
        <label
          htmlFor={name}
          className="text-[#696969] ml-2 text-sm font-medium text-gray-check-box"
        >
          {name}
        </label>
      </div>
    </>
  );
};

export default CheckBox;
