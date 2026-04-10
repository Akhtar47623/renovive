import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { MapPin } from "lucide-react";

const properties = [
  { image: property1, title: "Modern Glass Villa", location: "Beverly Hills, CA", price: "$2,450,000", beds: 4, baths: 3 },
  { image: property2, title: "Rustic Stone Estate", location: "Aspen, CO", price: "$1,890,000", beds: 5, baths: 4 },
  { image: property3, title: "Contemporary Pool House", location: "Miami, FL", price: "$3,200,000", beds: 6, baths: 5 },
];

const PropertiesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">Our Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Explore Our Latest Properties</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div key={prop.title} className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img src={prop.image} alt={prop.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-card-foreground mb-1">{prop.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin size={14} />
                  <span>{prop.location}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-accent font-bold text-lg">{prop.price}</span>
                  <span className="text-muted-foreground text-xs">{prop.beds} Beds • {prop.baths} Baths</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
