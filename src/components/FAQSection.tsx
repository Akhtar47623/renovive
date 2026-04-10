import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const faqs = [
  {
    id: "01",
    question: "How Does Our Platform Work?",
    answer:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
  },
  {
    id: "02",
    question: "Make a plan according to the concept",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit lorem sagittis, proin ut lectus sed ut. Enim egestas enim id duis vestibulum facilisis purus.",
  },
  {
    id: "03",
    question: "How Can I Find A Property To Buy or Sell",
    answer:
      "Our platform allows you to browse thousands of verified listings filtered by location, price, size, and more. You can connect directly with agents or list your property in minutes.",
  },
  {
    id: "04",
    question: "What Information is Included in Property Listings?",
    answer:
      "Each listing includes high-resolution photos, full address, square footage, number of bedrooms and bathrooms, pricing, and agent contact details. Virtual tours are available on select properties.",
  },
  {
    id: "05",
    question: "Is There a Fee to List My Property?",
    answer:
      "Basic listings are completely free. Premium placement and enhanced marketing packages are available for a competitive fee. Contact our team for a full breakdown of options.",
  },
  {
    id: "06",
    question: "How Do I Schedule a Property Viewing?",
    answer:
      "Simply click the 'View' button on any listing to open the booking panel. Choose a date and time that works for you and the agent will confirm within 24 hours.",
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>("01");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header block ── */}
        <div className="mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Frequently Ask Questions
          </h2>
          <p className="text-foreground/50 text-sm leading-relaxed max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* ── FAQ accordion list ── */}
        <div className="border border-foreground/10 rounded-2xl divide-y divide-foreground/10 overflow-hidden">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="group">
                {/* Question row */}
                <div
                  className="flex items-center justify-between px-6 md:px-8 py-6 cursor-pointer"
                  onClick={() => toggle(faq.id)}
                >
                  <h3
                    className={`font-serif text-xl md:text-2xl font-semibold leading-snug transition-colors duration-200 pr-6 ${
                      isOpen ? "text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {faq.question}
                  </h3>

                  {/* View + arrow buttons — matches PropertiesSection style */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-sm text-foreground/60 font-medium border border-foreground/20 rounded-full px-4 py-2 select-none">
                      View
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-foreground text-background border-foreground rotate-0"
                          : "hover:bg-foreground hover:text-background hover:border-foreground"
                      }`}
                    >
                      <ArrowUpRight
                        size={14}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </span>
                  </div>
                </div>

                {/* Answer — animated expand */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 300ms ease",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="text-foreground/50 text-sm leading-relaxed px-6 md:px-8 pb-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
