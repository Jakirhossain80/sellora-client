// src/pages/terms-and-conditions.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function TermsAndConditions() {
  return (
    <div className="w-full px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">
            Please read these terms carefully before using the application.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              By accessing or using Sellora, you agree to be bound by these Terms
              & Conditions. If you do not agree, please do not use the app.
            </p>
            <p className="text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Account security</h3>
              <p className="text-sm text-muted-foreground">
                You are responsible for maintaining the confidentiality of your
                account and for all activities that occur under your account.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Accurate details</h3>
              <p className="text-sm text-muted-foreground">
                You agree to provide accurate and up-to-date information,
                especially for delivery details.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders & Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Prices and availability may change without notice (based on your
                project rules).
              </li>
              <li>
                Orders may be rejected or cancelled if payment fails or items
                become unavailable.
              </li>
              <li>
                Refund and return rules depend on your project’s implementation
                and policies.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prohibited Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not attempt to access other users’ accounts or data.</li>
              <li>Do not abuse the system with spam or malicious actions.</li>
              <li>Do not upload harmful content where uploads are supported.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Sellora is provided “as is” for your project use. To the maximum
              extent permitted by law, we are not liable for indirect, incidental,
              or consequential damages resulting from your use of the app.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We may update these Terms & Conditions from time to time. Continued
              use of the app after changes means you accept the updated terms.
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a simple template for the UI. For real-world usage, adapt it
          to your business and consult legal guidance.
        </p>
      </div>
    </div>
  );
}

export default TermsAndConditions;
