
import ModernNavbar from "./Navbar";

export default function NavbarServer() {
  // Public pages must not read cookies or resolve a session on the server.
  // Either operation opts the shared layout into request-time rendering and
  // turns every service-page visit/prefetch into a CDN cache miss. The navbar
  // already resolves both values after hydration through SessionProvider and
  // localStorage, so its anonymous shell can be safely shared at the edge.
  return <ModernNavbar initialViewMode="customer" initialSession={null} />;
}
