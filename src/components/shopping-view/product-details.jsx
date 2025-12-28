import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useMemo, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ NEW

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  // ✅ NEW: include isAuthenticated so we can redirect
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const navigate = useNavigate(); // ✅ NEW
  const location = useLocation(); // ✅ NEW

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    // ✅ FIX: redirect to login if not authenticated (same behavior as Featured Products)
    if (!isAuthenticated) {
      navigate("/auth/login", {
        replace: false,
        state: { from: location.pathname + location.search },
      });
      return;
    }

    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

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

  // ✅ FIX: only close when Dialog changes to "closed"
  // This prevents scroll-lock issues caused by closing logic running on open.
  function handleDialogOpenChange(isOpen) {
    if (!isOpen) {
      setOpen(false);
      dispatch(setProductDetails());
      setRating(0);
      setReviewMsg("");
    }
  }

  function handleAddReview() {
    if (!productDetails?._id || !user?.id) return;

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success("Review added successfully!");
      }
    });
  }

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [dispatch, productDetails?._id]);

  const averageReview = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return (
      reviews.reduce(
        (sum, reviewItem) => sum + (reviewItem?.reviewValue || 0),
        0
      ) / reviews.length
    );
  }, [reviews]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {/* ✅ FIX: make dialog content itself scrollable on smaller screens */}
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[80vw] sm:max-w-[70vw] lg:max-w-[60vw] max-h-11/12 overflow-y-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            className="w-full object-cover p-6"
          />
        </div>

        <div>
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4 text-justify">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full cursor-pointer"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, index) => (
                  <div
                    key={reviewItem?._id || `${reviewItem?.userId}-${index}`}
                    className="flex gap-4"
                  >
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {(reviewItem?.userName?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>

              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>

              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />

              <Button
                className="cursor-pointer"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
