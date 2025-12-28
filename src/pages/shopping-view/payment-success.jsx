import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Stripe Checkout session id (optional, for reference/debugging)
  const sessionId = searchParams.get("session_id");

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">
          Payment is successful! ✅
        </CardTitle>
      </CardHeader>

      {sessionId && (
        <p className="mt-3 text-sm text-muted-foreground">
          Stripe Session ID: <span className="font-medium">{sessionId}</span>
        </p>
      )}

      <Button
        className="mt-5 cursor-pointer"
        onClick={() => navigate("/shop/account")}
      >
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
