export function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 rounded-lg font-semibold transition ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  