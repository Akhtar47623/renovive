import mission1 from "@/assets/mission-1.png";
import mission2 from "@/assets/mission-2.png";

const MissionSection = () => {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="w-full">
          <h2 className="font-sans font-semibold text-[36px] leading-[129%] tracking-[-0.02em] text-foreground [text-wrap:balance] md:text-display-lg md:max-w-[32ch]">
            We Are on A Mission to Change View
            <br className="hidden md:block" />
            of Real Estate Field
          </h2>
          <p className="font-sans font-normal text-[16px] leading-[150%] tracking-[0em] text-foreground/50 mt-3 max-w-2xl md:text-text-md">
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

