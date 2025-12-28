import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCartItems } from "@/store/shop/cart-slice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const sessionId = searchParams.get("session_id");

  // ✅ prevent double-run in React Strict Mode
  const ranRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (!sessionId || !user?.id) return;
      if (ranRef.current) return;
      ranRef.current = true;

      try {
        // ✅ 1) Verify payment is actually paid
        const verifyRes = await axios.get(
          `${API_BASE_URL}/api/shop/stripe/verify-session/${sessionId}`,
          { withCredentials: true }
        );

        if (verifyRes?.data?.success && verifyRes?.data?.isPaid) {
          // ✅ 2) Clear cart in DB + Redux
          await dispatch(clearCartItems({ userId: user.id }));
        }
      } catch (err) {
        console.error("Payment success verification failed:", err);
      }
    };

    run();
  }, [sessionId, user?.id, dispatch]);

  return (
    <div className="w-full px-4 py-10 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl">
            Payment Successful ✅
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you! Your payment has been completed successfully.
          </p>

          {sessionId ? (
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-sm text-muted-foreground">
                Stripe Session ID:
              </p>
              <p className="text-sm font-medium break-all">{sessionId}</p>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="w-full" onClick={() => navigate("/shop/account")}>
              View Orders
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/shop/home")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
