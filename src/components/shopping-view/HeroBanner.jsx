import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HeroBanner({ image }) {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[400px] md:h-[520px] overflow-hidden rounded-lg">
      {/* Banner Image */}
      <img
        src={image}
        alt="Sellora Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text & Button */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Discover the Best Products
        </h1>

        <p className="mt-4 max-w-xl text-base md:text-lg text-white/90">
          Shop premium products with amazing deals and fast delivery.
        </p>

        <Button
          onClick={() => navigate("/shop/listing")}
          className="mt-6 px-6 py-3 text-base font-semibold"
        >
          Shop Now
        </Button>
      </div>
    </section>
  );
}

export default HeroBanner;
