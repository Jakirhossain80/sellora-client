import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  // ✅ total stock from product (DB stock)
  const stock = Number(product?.totalStock ?? 0);

  // ✅ get cart items from redux
  const { cartItems } = useSelector((state) => state.shopCart);

  // ✅ quantity of THIS product already in cart
  const inCartQty = useMemo(() => {
    const items = Array.isArray(cartItems?.items) ? cartItems.items : [];
    const pid = product?._id;

    if (!pid) return 0;

    const found = items.find((i) => String(i.productId) === String(pid));
    return Number(found?.quantity ?? 0);
  }, [cartItems?.items, product?._id]);

  // ✅ remaining stock for user (DB stock - in cart)
  const remainingStock = useMemo(() => {
    if (Number.isNaN(stock)) return 0;
    return stock - inCartQty;
  }, [stock, inCartQty]);

  // ✅ Out of stock state should trigger when:
  // - product stock is 0/less OR
  // - user already added max quantity to cart
  const isOutOfStock = remainingStock <= 0;

  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer hover:scale-101 transition-all duration-300 overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleGetProductDetails?.(product?._id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleGetProductDetails?.(product?._id);
          }
        }}
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title || "Product image"}
            className="w-full object-cover rounded-t-lg p-4"
            loading="lazy"
          />

          {/* ✅ Dark overlay when out of stock (including cart stock limit reached) */}
          {isOutOfStock ? (
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
          ) : null}

          {/* ✅ Badge rules (keep your existing behavior but based on remainingStock) */}
          {isOutOfStock ? (
            <Badge className="absolute top-2 left-2 z-20 bg-black/80 text-white hover:bg-black/80">
              Out Of Stock
            </Badge>
          ) : remainingStock < 10 ? (
            <Badge className="absolute top-2 left-2 z-20 bg-red-500 hover:bg-red-600">
              {`Only ${remainingStock} items left`}
            </Badge>
          ) : Number(product?.salePrice) > 0 ? (
            <Badge className="absolute top-2 left-2 z-20 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap?.[product?.category] || product?.category}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap?.[product?.brand] || product?.brand}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                Number(product?.salePrice) > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>

            {Number(product?.salePrice) > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Button
          type="button"
          className={`w-full ${
            isOutOfStock ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isOutOfStock) return;

            // ✅ send stock so your existing handler still prevents overflow
            handleAddtoCart?.(product?._id, stock);
          }}
          disabled={isOutOfStock || !product?._id}
          aria-disabled={isOutOfStock || !product?._id}
        >
          {isOutOfStock ? "Out Of Stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
