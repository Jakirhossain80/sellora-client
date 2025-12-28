import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const dispatch = useDispatch();

  const items = cartItems?.items || [];

  const totalCartAmount = useMemo(() => {
    return items.length > 0
      ? items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              (item?.quantity || 0),
          0
        )
      : 0;
  }, [items]);

  // STEP 1: Create order in DB (pending)
  async function handleInitiatePayment() {
    if (!items.length) {
      toast.error("Your cart is empty. Please add items to proceed");
      return;
    }

    if (!currentSelectedAddress) {
      toast.error("Please select one address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "card",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsPaymentStart(true);

    const result = await dispatch(createNewOrder(orderData));

    if (result?.payload?.success) {
      handleStripeCheckout();
    } else {
      toast.error("Failed to initiate order");
      setIsPaymentStart(false);
    }
  }

  // STEP 2: Redirect to Stripe Checkout
  async function handleStripeCheckout() {
    try {
      const payload = {
        cartItems: items.map((item) => ({
          title: item.title,
          price: item.salePrice > 0 ? item.salePrice : item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerEmail: user?.email,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/shop/stripe/create-checkout-session`,
        payload,
        { withCredentials: true }
      );

      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to redirect to Stripe Checkout");
      setIsPaymentStart(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout banner"
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        {/* Address Section */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Cart + Payment Section */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <UserCartItemsContent
              key={item?._id || item?.productId}
              cartItem={item}
            />
          ))}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePayment}
              disabled={isPaymentStart}
              className="w-full"
            >
              {isPaymentStart
                ? "Processing Payment..."
                : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
