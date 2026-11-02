import { Link, useLocation } from "react-router-dom";
import { HiOutlineViewGrid } from "react-icons/hi";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--color-card-bg)] border-r-2 border-dashed border-[var(--color-border-sketch)] flex flex-col">
      <div className="p-6 border-b-2 border-dashed border-[var(--color-border-sketch)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] flex items-center justify-center text-white text-lg font-bold rotate-[-3deg] shadow-sm">
            H
          </div>
          <div>
            <h1 className="hand-text text-xl text-[var(--color-ink)]">Gesture</h1>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-ink-light)] font-semibold">
              Analytics
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 relative group ${
                active
                  ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] border-2 border-[var(--color-accent-blue)]/20"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-dark)]/50 border-2 border-transparent"
              }`}
            >
              <div className={`transition-transform duration-300 ${active ? "scale-110 -rotate-6" : "group-hover:scale-105"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold tracking-wide">{item.label}</span>
              {active && (
                <div className="ml-auto w-2 h-2 rounded-sm bg-[var(--color-accent-yellow)] rotate-45" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
