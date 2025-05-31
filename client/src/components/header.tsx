export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Blog Generator</h1>
              <p className="text-xs text-slate-500">Powered by Google Gemini</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Dashboard</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Templates</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm font-medium">History</a>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <i className="fas fa-user mr-2"></i>Account
            </button>
          </nav>
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
