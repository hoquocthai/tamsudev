import { ComponentProps, forwardRef, useState } from "react";
import { FieldError } from "../Form/Form";

interface Props extends ComponentProps<"input"> {
  label?: string;
}
export const UploadField = forwardRef<HTMLInputElement, Props>(function Upload(
  { label, ...props },
  ref
) {
  return (
    <label className="w-full mt-[10px]">
      {label && (
        <div className="label flex items-center mb-1 space-x-1.5">{label}</div>
      )}
      <input
        type="file"
        {...props}
        onChange={props.onChange}
        accept="image/png, image/gif, image/jpeg"
        ref={ref}
      />
      {props.name && <FieldError name={props.name} />}
    </label>
  );
});
