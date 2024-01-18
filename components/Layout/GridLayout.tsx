import React, { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  className?: string;
}

export const GridLayout: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`container max-w-screen-xl flex-grow px-0  ${className}`}>
      <div className="grid grid-cols-12 lg:gap-8">{children}</div>
    </div>
  );
};

export const GridItemTwelve: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return <div className={`col-span-12 ${className}`}>{children}</div>;
};

export const GridItemTen: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`lg:col-span-10 md:col-span-12 col-span-12 mb-5 ${className}`}
    >
      {children}
    </div>
  );
};

export const GridItemNight: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`lg:col-span-9 md:col-span-12 col-span-12 mb-5 ${className}`}
    >
      {children}
    </div>
  );
};

export const GridItemEight: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`lg:col-span-8 md:col-span-12 col-span-12 mb-5 ${className}`}
    >
      {children}
    </div>
  );
};

export const GridItemSix: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`lg:col-span-6 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemFour: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`lg:col-span-4 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemThree: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`lg:col-span-3 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  );
};

export const GridItemTwo: React.FunctionComponent<GridProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`lg:col-span-2 md:col-span-12 col-span-12 ${className}`}>
      {children}
    </div>
  );
};
