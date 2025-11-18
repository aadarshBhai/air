import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, AlertCircle, Award } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            These terms govern your use of AirNex's website and services. By using our platform, 
            you agree to these terms and conditions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: November 15, 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Acceptance of Terms */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using AirNex's website and services, you agree to be bound by 
                these Terms of Service and all applicable laws and regulations.
              </p>
              <p>
                If you do not agree with any of these terms, you are prohibited from using or 
                accessing this site. The materials contained in this website are protected by 
                applicable copyright and trademark law.
              </p>
            </div>
          </div>

          {/* Products and Services */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Products and Services</h2>
            <div className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Product Information</h3>
                <p>
                  We strive to provide accurate product descriptions, pricing, and availability. 
                  However, we do not warrant that product descriptions, colors, information, 
                  or other content of the website are accurate, complete, reliable, current, 
                  or error-free.
                </p>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Pricing</h3>
                <p>
                  All prices are displayed in Indian Rupees (₹) and are inclusive of applicable taxes 
                  unless otherwise stated. We reserve the right to modify prices at any time without 
                  prior notice.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-black text-foreground mb-2">Price Changes</h4>
                  <p className="text-sm">
                    Prices for products are subject to change without notice. Orders placed at 
                    the current price will be honored, even if prices change after order placement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">User Responsibilities</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>As a user of our services, you agree to:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Provide Accurate Information:</strong> Ensure all personal and payment 
                    information provided is accurate and complete
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Maintain Account Security:</strong> Keep your login credentials secure 
                    and confidential
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Use Services Lawfully:</strong> Use our platform for lawful purposes 
                    and in compliance with all applicable laws
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Respect Intellectual Property:</strong> Not reproduce, duplicate, copy, 
                    sell, or exploit any portion of our services
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Prohibited Activities</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>You are strictly prohibited from:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Technical Violations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Hacking or attempting to breach security</li>
                    <li>• Using automated tools to access the site</li>
                    <li>• Interfering with website functionality</li>
                    <li>• Introducing malware or viruses</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Content Violations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Posting offensive or illegal content</li>
                    <li>• Harassing other users</li>
                    <li>• Spamming or sending unsolicited messages</li>
                    <li>• Violating intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Billing */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Payment and Billing</h2>
            <div className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Payment Methods</h3>
                <p>
                  We accept various payment methods including credit/debit cards, UPI, net banking, 
                  and digital wallets. All payment transactions are processed through secure 
                  payment gateways.
                </p>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Billing Practices</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <strong>Order Confirmation:</strong> You will receive an order confirmation 
                      with details of your purchase
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <strong>Invoicing:</strong> Invoices are generated automatically upon 
                      successful payment
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <strong>Refund Policy:</strong> Refunds are processed according to our 
                      Return Policy terms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                All content on this website, including but not limited to text, graphics, logos, 
                images, audio clips, digital downloads, data compilations, and software, is the 
                property of AirNex or its content suppliers and is protected by international 
                copyright laws.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-2">What You Cannot Do:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Use our trademarks without permission</li>
                  <li>• Copy or redistribute our content</li>
                  <li>• Create derivative works from our materials</li>
                  <li>• Use our content for commercial purposes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                In no event shall AirNex, its directors, employees, partners, agents, suppliers, 
                or affiliates be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, 
                goodwill, or other intangible losses.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-2">Maximum Liability</h3>
                <p className="text-sm">
                  Our total liability to you for any cause of action whatsoever, and regardless 
                  of the form of the action, will at all times be limited to the amount paid, 
                  if any, by you to us for the product(s) at issue.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your access immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach 
                the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will cease immediately. All 
                provisions of the Terms which by their nature should survive termination shall 
                survive, including ownership provisions, warranty disclaimers, and limitations 
                of liability.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. If we make material 
                changes, we will notify you by email or by posting a notice on our website 
                prior to the change becoming effective.
              </p>
              <p>
                Your continued use of our services after any such changes constitutes your 
                acceptance of the new terms.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-black mb-4">Questions About Our Terms?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/contact">Contact Legal Team</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:legal@airnex.com">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
