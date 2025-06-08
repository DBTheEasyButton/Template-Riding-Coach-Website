export default function AdminTest() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-navy mb-4">Admin Panel</h1>
        <p className="text-xl text-gray-600">Admin routing is working!</p>
        <a href="/" className="inline-block mt-4 px-4 py-2 bg-navy text-white rounded hover:bg-slate-800">
          Back to Home
        </a>
      </div>
    </div>
  );
}