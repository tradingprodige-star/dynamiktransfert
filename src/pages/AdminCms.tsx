import AdminCmsManager from "@/components/admin/AdminCmsManager";

const AdminCms = () => (
  <main className="min-h-screen bg-slate-100 px-4 py-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">DYNAMIK Admin</p>
        <h1 className="mt-3 text-3xl font-bold md:text-5xl">CMS du site public</h1>
        <p className="mt-3 max-w-3xl text-white/65">
          Modifiez les textes, codes partenaires et annonces du site DYNAMIK Transfert. Les modifications enregistrées sont reprises par les pages publiques.
        </p>
      </div>
      <AdminCmsManager />
    </div>
  </main>
);

export default AdminCms;
