import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Footer from "@/components/shopping-view/Footer";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

// ✅ Banner slide with text + button overlay (merged improvement)
function HeroBannerSlide({ image, isActive, eager = false }) {
  const navigate = useNavigate();

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: isActive ? "auto" : "none" }}
    >
      {/* Banner Image */}
      <img
        src={image}
        alt="Sellora Banner"
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Text + Button */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Discover the Best Products
        </h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-white/90">
          Shop premium products with amazing deals and fast delivery.
        </p>

        <Button
          type="button"
          onClick={() => navigate("/shop/listing")}
          className="mt-6 px-6 py-3 text-base font-semibold cursor-pointer"
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
}

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const featureImagesCount = useMemo(
    () => (featureImageList ? featureImageList.length : 0),
    [featureImageList]
  );

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!featureImagesCount) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImagesCount);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImagesCount]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // keep currentSlide always valid when images list changes
  useEffect(() => {
    if (!featureImagesCount) return;
    setCurrentSlide((prev) => (prev >= featureImagesCount ? 0 : prev));
  }, [featureImagesCount]);

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      {/* ✅ Banner Slider (kept) + ✅ Text/Button overlay (added) */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <HeroBannerSlide
                key={slide?._id || slide?.image || index}
                image={slide?.image}
                isActive={index === currentSlide}
                eager={index === 0}
              />
            ))
          : null}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            featureImagesCount
              ? setCurrentSlide(
                  (prevSlide) =>
                    (prevSlide - 1 + featureImagesCount) % featureImagesCount
                )
              : null
          }
          className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 bg-white/80 cursor-pointer"
          disabled={!featureImagesCount}
          type="button"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            featureImagesCount
              ? setCurrentSlide(
                  (prevSlide) => (prevSlide + 1) % featureImagesCount
                )
              : null
          }
          className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 bg-white/80 cursor-pointer"
          disabled={!featureImagesCount}
          type="button"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem?._id || productItem?.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />


      <section>
        <footer>
          <Footer/>
        </footer>
      </section>
    </div>
  );
}

export default ShoppingHome;
