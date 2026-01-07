import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Terms of Service
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Last updated: January 6, 2025
              </p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By accessing and using Rotection ("the Service"), you agree
                    to be bound by these Terms of Service. If you do not agree,
                    do not use the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    2. Description of Service
                  </h2>
                  <p className="text-muted-foreground">
                    Rotection is a platform for rating, reviewing, and
                    discovering Roblox games. Users can submit games, write
                    reviews, and interact with content related to Roblox gaming.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    3. User Accounts
                  </h2>
                  <p className="text-muted-foreground">
                    Certain features require registration. You are responsible
                    for your account security and any activity under your
                    account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    4. User Content
                  </h2>
                  <p className="text-muted-foreground">
                    You retain ownership of content you post but grant Rotection
                    a license to display and distribute it. Content must comply
                    with all laws and third-party rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    5. Prohibited Uses
                  </h2>
                  <div className="text-muted-foreground">
                    <p className="mb-2">You may not use the Service to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Violate laws or regulations</li>
                      <li>Post spam, harassment, or offensive content</li>
                      <li>Impersonate others or provide false information</li>
                      <li>Interfere with Service operations</li>
                      <li>Attempt unauthorized access to other accounts</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    6. Content Moderation
                  </h2>
                  <p className="text-muted-foreground">
                    Rotection may review, edit, or remove content violating
                    these Terms and may suspend or terminate accounts for
                    violations.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Privacy</h2>
                  <p className="text-muted-foreground">
                    Your privacy is important. Our Privacy Policy explains how
                    we handle your data and applies to your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    8. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground">
                    All Service content, features, and functionality are the
                    property of Rotection or its licensors and protected by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Disclaimers</h2>
                  <p className="text-muted-foreground">
                    The Service is provided "as is" and "as available."
                    Rotection makes no warranties regarding the Service's
                    operation or content.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    10. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground">
                    Rotection is not liable for any damages arising from the use
                    of the Service, including direct, indirect, incidental, or
                    consequential damages.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    11. Termination
                  </h2>
                  <p className="text-muted-foreground">
                    We may suspend or terminate your account immediately,
                    without notice, for any reason, including violations of
                    these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    12. Changes to Terms
                  </h2>
                  <p className="text-muted-foreground">
                    We may modify these Terms at any time. Material changes will
                    be communicated at least 30 days before taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    13. Contact Information
                  </h2>
                  <div className="text-muted-foreground">
                    <p>For questions about these Terms, contact us at:</p>
                    <div className="mt-3 p-4 bg-muted rounded-lg">
                      <p className="font-semibold">RotectionTeam@outlook.com</p>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
