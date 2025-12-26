import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./Footer";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen py-12 flex-col bg-background overflow-hidden">
      <ShoppingHeader />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default ShoppingLayout;
