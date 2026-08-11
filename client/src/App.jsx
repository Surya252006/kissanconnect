import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4">
        <h1 className="text-2xl font-bold">KisanConnect</h1>
        <p className="text-sm text-green-100">Farmer-to-Buyer Agricultural Marketplace</p>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Welcome to KisanConnect</h2>
      <p className="text-gray-600 mb-6">
        Connecting farmers directly with buyers for fresh agricultural produce.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['tomato', 'onion', 'potato', 'carrot'].map((product) => (
          <div key={product} className="bg-white rounded-lg shadow p-4">
            <img
              src={`/products/${product}.jpg`}
              alt={product}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="text-center font-medium capitalize">{product}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App