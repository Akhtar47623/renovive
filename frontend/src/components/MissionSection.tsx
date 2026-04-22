import mission1 from "@/assets/mission-1.png";
import mission2 from "@/assets/mission-2.png";

const MissionSection = () => {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-display-lg font-semibold tracking-[-0.02em] text-foreground">
            We Are on A Mission to Change View
            <br />
            of Real Estate Field
          </h2>
          <p className="text-text-md leading-[150%] tracking-[0em] font-normal text-foreground/50 mt-3 max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit lorem
            sagittis, proin ut lectus sed ut. Enim egestas enim id duis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-10 md:mt-12">
          <div className="rounded-2xl overflow-hidden border border-foreground/10">
            <img
              src={mission1}
              alt="Modern home by the pool"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-foreground/10">
            <img
              src={mission2}
              alt="Minimal concrete home by the lake"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

