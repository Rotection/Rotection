import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Privacy Policy
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Last updated: January 6, 2025
              </p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    1. Information Collection
                  </h2>
                  <p className="text-muted-foreground">
                    Rotection collects your Roblox username and user ID solely
                    for authentication purposes. No other personal data is
                    collected.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    2. Use of Information
                  </h2>
                  <p className="text-muted-foreground">
                    Your information is used only to provide and improve the
                    Service, including user authentication and personalized
                    features.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    3. Data Sharing
                  </h2>
                  <p className="text-muted-foreground">
                    Rotection does not share your personal data with third
                    parties except as required by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    4. Data Security
                  </h2>
                  <p className="text-muted-foreground">
                    We implement reasonable measures to protect your data but
                    cannot guarantee complete security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    5. Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground">
                    The Service does not use cookies or third-party tracking for
                    personal data collection.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    6. Children's Privacy
                  </h2>
                  <p className="text-muted-foreground">
                    The Service is intended for users 13 years and older. We do
                    not knowingly collect data from children under 13.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    7. Changes to Privacy Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy at any time. Material
                    changes will be posted on this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    8. Contact Information
                  </h2>
                  <div className="text-muted-foreground">
                    <p>
                      For questions about this Privacy Policy, contact us at:
                    </p>
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

export default PrivacyPolicy;
