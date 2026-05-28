import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";

import ProductListPage from "./pages/ProductListPage";

import ProductDetailPage from "./pages/ProductDetailPage";


function App() {

  return (

    <>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/products"
          element={<ProductListPage />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetailPage />}
        />

      </Routes>
    </>
  );
}

export default App;