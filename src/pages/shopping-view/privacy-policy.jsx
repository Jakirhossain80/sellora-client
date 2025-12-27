// src/pages/privacy-policy.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function PrivacyPolicy() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            This page explains what data we collect and how we use it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              We respect your privacy and aim to keep your information safe.
              This policy describes the types of data we may collect when you
              use the Sellora app, why we collect it, and the choices you have.
            </p>
            <p className="text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Account data</h3>
              <p className="text-sm text-muted-foreground">
                Information such as your username and email used for login and
                account management.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Order data</h3>
              <p className="text-sm text-muted-foreground">
                Order details (items, quantities, totals) and delivery address
                information provided during checkout.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Usage data</h3>
              <p className="text-sm text-muted-foreground">
                Basic analytics about how you use the app (for example, pages
                visited) to improve performance and user experience.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>To authenticate users and keep accounts secure.</li>
              <li>To process orders and show order status/history.</li>
              <li>To improve the app, fix bugs, and enhance usability.</li>
              <li>
                To protect against fraud, abuse, and unauthorized access.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies & Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We may use cookies or similar technologies to keep you signed in
              and to maintain session state. You can control cookies through
              your browser settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>You can update certain account details from your profile.</li>
              <li>
                You can logout anytime to end your current authenticated
                session.
              </li>
              <li>
                You can request deletion of your account data (if supported by
                your project setup).
              </li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a simple template policy for your project UI. For a production
          store, consult a legal professional to match your business and
          jurisdiction.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
