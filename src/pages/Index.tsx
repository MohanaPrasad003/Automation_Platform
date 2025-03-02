
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AI Promptify - Automate Your Workflows with Natural Language</title>
        <meta name="description" content="Describe what you want to automate in plain English, and our AI will create and configure the workflow for you." />
      </Helmet>
      
      <Navbar />
      
      <main className="overflow-hidden">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Simplify Your Workflow Automation?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already saving time and resources by using AI-powered workflow automation.
              </p>
              <a
                href="/auth?mode=signup"
                className="inline-block bg-automation-primary text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
              >
                Get Started for Free
              </a>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required. Free plan available.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
