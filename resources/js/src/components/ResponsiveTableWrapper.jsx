export default function ResponsiveTableWrapper({ children }) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] md:min-w-full">{children}</div>
      </div>
    );
  }
  