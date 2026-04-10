import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import agent4 from "@/assets/agent-4.jpg";

const agents = [
  { image: agent1, name: "James Mitchell", role: "Senior Architect" },
  { image: agent2, name: "Sarah Rodriguez", role: "Interior Designer" },
  { image: agent3, name: "David Chen", role: "Project Manager" },
  { image: agent4, name: "Emily Parker", role: "Design Consultant" },
];

const AgentsSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">Our Team</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Agents</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <div key={agent.name} className="text-center group">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-4">
                <img src={agent.image} alt={agent.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-serif font-semibold text-foreground">{agent.name}</h3>
              <p className="text-muted-foreground text-sm">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
