import { Users, Award, Heart, Star, Shield, Lock } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "For Players",
    description: "Browse verified games, see safety scores, and rate games you've played to help others!",
  },
  {
    icon: Award,
    title: "For Developers",
    description: "Submit your game, earn the Rotection Verified badge, and show players you're trustworthy!",
  },
  {
    icon: Heart,
    title: "For Parents",
    description: "See safety scores and age ratings to make sure games are appropriate for your kids!",
  },
  {
    icon: Star,
    title: "Community Ratings",
    description: "Players rate games on honesty, safety, fairness, and age-appropriateness.",
  },
  {
    icon: Shield,
    title: "Moderator Review",
    description: "Our team reviews all games and ratings to make sure everything is accurate and fair.",
  },
  {
    icon: Lock,
    title: "Safety First",
    description: "Only games that meet our standards get the Rotection Verified badge.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl text-primary mb-4">
            How Rotection Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We make it easy to find safe games and help developers show they care about player safety.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
