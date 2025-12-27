// src/pages/faq.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function FAQ() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Quick answers to common questions about shopping, orders, and
            accounts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shopping & Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                How do I find products?
              </h3>
              <p className="text-sm text-muted-foreground">
                Browse the listing page by category, or use the search page to
                quickly find what you need.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Do you offer discounts or sale prices?
              </h3>
              <p className="text-sm text-muted-foreground">
                Some products may have a sale price. If available, you’ll see it
                alongside the regular price.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Can a product go out of stock?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. Stock can change quickly. If an item becomes unavailable,
                you may not be able to increase its quantity in the cart.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart & Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                How do I add items to my cart?
              </h3>
              <p className="text-sm text-muted-foreground">
                Open a product and use the add-to-cart action. You can adjust
                quantities from the cart panel.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Where can I review my cart total?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your cart total is shown in the cart panel and again during
                checkout.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                What happens after payment success?
              </h3>
              <p className="text-sm text-muted-foreground">
                After a successful payment, you’ll be redirected to the payment
                success page. Your order should then appear in your account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account & Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Do I need an account to shop?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. Please login or register to add items to the cart and place
                orders.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Where can I see my order history?
              </h3>
              <p className="text-sm text-muted-foreground">
                Go to your Account page to view your order details and status.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                How do I logout?
              </h3>
              <p className="text-sm text-muted-foreground">
                Use the user menu in the header and click “Logout”.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Need more help? Contact support from your account page or reach out via
          your project’s support channel.
        </p>
      </div>
    </div>
  );
}

export default FAQ;
