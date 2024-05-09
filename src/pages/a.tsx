import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useHotkeys } from "react-hotkeys-hook";
import { Route, Routes, useNavigate } from "react-router-dom";

import PrivateRoute from "../components/private-route";
import SEO from "../components/seo";
import Layout from "../components/templates/layout";
import Inventory from "../domain/inventory";
import Oauth from "../domain/oauth";
import Orders from "../domain/orders";
import OverviewRoute from "../domain/overview";
import ProductsRoute from "../domain/products";
import Settings from "../domain/settings";

const IndexPage = () => {
  const navigate = useNavigate();
  useHotkeys("g + o", () => navigate("/a/orders"));
  useHotkeys("g + p", () => navigate("/a/products"));

  return (
    <PrivateRoute>
      <DashboardRoutes />
    </PrivateRoute>
  );
};

const DashboardRoutes = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO title="Medusa" />
        <Routes>
          <Route path="/overview" element={<OverviewRoute />} />
          <Route path="oauth/:app_name" element={<Oauth />} />
          <Route path="products/*" element={<ProductsRoute />} />
          <Route path="orders/*" element={<Orders />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="inventory/*" element={<Inventory />} />
        </Routes>
      </Layout>
    </DndProvider>
  );
};

export default IndexPage;
