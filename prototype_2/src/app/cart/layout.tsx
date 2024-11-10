export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Cart-specific layout elements */}
      {children}
    </div>
  );
} 