import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Database, Users } from "lucide-react";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your personal information when you use our services.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: November 15, 2025
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Information We Collect */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Information We Collect</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Personal Information</h3>
                <p>When you use our services, we may collect:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Name, email address, and phone number</li>
                  <li>• Shipping and billing address</li>
                  <li>• Payment information (processed securely)</li>
                  <li>• Order history and preferences</li>
                </ul>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-black text-foreground">Technical Information</h3>
                <p>We automatically collect:</p>
                <ul className="space-y-2 ml-6">
                  <li>• IP address and device information</li>
                  <li>• Browser type and operating system</li>
                  <li>• Pages visited and time spent</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>We use your information to:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Service Delivery</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Process and fulfill orders</li>
                    <li>• Provide customer support</li>
                    <li>• Send order confirmations</li>
                    <li>• Track deliveries</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Communication</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Send promotional offers</li>
                    <li>• Share product updates</li>
                    <li>• Respond to inquiries</li>
                    <li>• Provide newsletters</li>
                  </ul>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-2">Business Operations</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Improve our services</li>
                  <li>• Conduct market research</li>
                  <li>• Prevent fraud and abuse</li>
                  <li>• Comply with legal requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Data Protection & Security</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Encryption:</strong> All data is encrypted using SSL/TLS protocols
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Secure Servers:</strong> Information stored on secure, monitored servers
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Access Control:</strong> Limited access to authorized personnel only
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Regular Audits:</strong> Periodic security assessments and updates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Sharing */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Third-Party Sharing</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We may share your information with:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Service Partners</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Payment processors</li>
                    <li>• Shipping carriers</li>
                    <li>• Cloud service providers</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Legal Requirements</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Law enforcement agencies</li>
                    <li>• Regulatory authorities</li>
                    <li>• Court orders</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Your Rights</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Access:</strong> Request a copy of your personal information
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Correct:</strong> Update inaccurate or incomplete information
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Delete:</strong> Request removal of your personal information
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Cookies & Tracking</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar technologies to enhance your experience:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Essential Cookies:</strong> Required for basic site functionality
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Performance Cookies:</strong> Help us understand site usage
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Marketing Cookies:</strong> Used for personalized advertising
                  </div>
                </div>
              </div>
              <p className="text-sm">
                You can manage cookie preferences through your browser settings.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-black mb-4">Privacy Questions?</h2>
            <p className="text-muted-foreground mb-6">
              If you have questions about this privacy policy or how we handle your data, 
              please contact our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/contact">Contact Privacy Team</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:privacy@airnex.com">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
