export default function TopBar() {
  return (
    <div className="w-full bg-green-700 text-white text-sm py-1 px-4">
      <div className="max-w-screen-xl mx-auto flex justify-end gap-6">
        <a href="/impressum" className="hover:underline">
          Impressum
        </a>
        <a href="/datenschutz" className="hover:underline">
          Datenschutz
        </a>
        <a href="/login" className="hover:underline">
          Login
        </a>
      </div>
    </div>
  );
}
