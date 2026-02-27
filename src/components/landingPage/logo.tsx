import senseable from "/assets/senseable.png";

export function Logo() {
  return (
    <div className="flex items-center justify-center rounded-md">
      <img src={senseable} alt="logo" className="h-8 w-auto object-contain" />
    </div>
  );
}
