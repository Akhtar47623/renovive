import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How long does a typical renovation project take?", a: "Most renovation projects take between 4 to 12 weeks, depending on the scope. We provide detailed timelines during the initial consultation." },
  { q: "Do you handle permits and inspections?", a: "Yes, we manage all necessary permits, inspections, and compliance requirements for your renovation project." },
  { q: "Can I live in my home during renovation?", a: "In most cases, yes. We plan the work in phases to minimize disruption to your daily life, though some projects may require temporary relocation." },
  { q: "What is your payment structure?", a: "We typically require a deposit to begin, with milestone-based payments throughout the project. Detailed payment schedules are outlined in our contracts." },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-14">
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-lg border border-border px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
