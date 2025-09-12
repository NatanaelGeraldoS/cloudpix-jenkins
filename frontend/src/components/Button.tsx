import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps<T = any> = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick?: (row: T) => void; 
};

const Button = <T extends unknown>({
  onClick,
  children,
  ...rest
}: React.PropsWithChildren<ButtonProps<T>>) => {
  return (
    <button
      className="bg-amber-600 dark:bg-amber-500 text-white py-2 px-3 rounded-md 
                 hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(e as any); 
        }
      }}
      {...rest} 
    >
      {children}
    </button>
  );
};

export default Button;
