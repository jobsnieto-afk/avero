type DashboardHeaderProps = {
  email: string;
  handleLogout: () => void;
};

export function DashboardHeader({
  email,
  handleLogout,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
          Dashboard privado
        </p>

        <h1 className="mt-2 text-4xl font-semibold">
          Bienvenido a AVERO
        </h1>

        <p className="mt-2 text-slate-400">
          {email}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm"
      >
        Cerrar sesión
      </button>
    </div>
  );
}