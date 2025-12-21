import { 
  Target, 
  Flame, 
  Calendar, 
  Users, 
  Moon, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  Sparkles,
  Heart,
  Church,
  BarChart3,
  RefreshCw,
  Gift,
  Sun
} from "lucide-react";
import HeroBackground from "@/components/home/HeroBackground";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className = "" }: FeatureCardProps) => (
  <div 
    className={`bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 flex flex-col items-start ${className}`}
  >
    <div className="bg-primary-blue/10 p-4 rounded-xl mb-6">
      <Icon className="w-8 h-8 text-primary-blue" />
    </div>
    <h3 className="font-serif text-2xl font-bold text-text-dark mb-4">{title}</h3>
    <p className="text-text-light leading-relaxed">{description}</p>
  </div>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="text-center mb-12">
    <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-dark mb-4">{children}</h2>
    {subtitle && <p className="text-text-light max-w-2xl mx-auto font-light">{subtitle}</p>}
    <div className="w-24 h-1 bg-accent-green mx-auto mt-6 rounded-full"></div>
  </div>
);

export default function KeyFeaturesPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 overflow-hidden bg-background-mist/30">
      <HeroBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-text-dark mb-6">
            The <span className="text-primary-blue italic">HeGuidesMe</span> Journal
          </h1>
          <p className="text-xl md:text-2xl text-text-light max-w-3xl mx-auto font-light leading-relaxed">
            A comprehensive guide designed to help you document your spiritual growth, track your commitment, and deepen your relationship with God.
          </p>
        </div>

        {/* Section 1: Annual Foundation */}
        <div className="mb-32">
          <SectionTitle subtitle="Start your year with clear purpose and a heart open to God's lead.">Annual Foundation</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={Target}
              title="MY RESOLUTIONS"
              description="Dedicated space to write down your resolutions for the year. Commit your goals to paper and invite God into your aspirations."
            />
            <FeatureCard 
              icon={Flame}
              title="MY SOLEMN PRAYER"
              description="A sanctuary for your personal prayer to God, capturing your deepest hopes and anticipations for the year ahead."
            />
          </div>
        </div>

        {/* Section 2: Monthly Engagement */}
        <div className="mb-32">
          <SectionTitle subtitle="Maintain focus and intercede for others throughout every month.">Monthly Engagement</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={Calendar}
              title="PRAYER POINTS"
              description="At the beginning of every month, write down your petitions. Stay focused on your spiritual dialogue throughout the weeks."
            />
            <FeatureCard 
              icon={Users}
              title="PEOPLE I AM PRAYING FOR"
              description="Keep a dynamic list of those you intercede for. Update it as you journey through the month, remembering that fervent prayer availth much (James 5:16)."
            />
          </div>
        </div>

        {/* Section 3: Daily Quiet Time */}
        <div className="mb-32 bg-white/40 backdrop-blur-md p-12 rounded-[3rem] border border-white/50 shadow-inner">
          <SectionTitle subtitle="The heart of your journal — tools for daily reflection and hearing from the Holy Spirit.">Daily Quiet Time (QT)</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="bg-primary-blue/10 w-fit p-3 rounded-xl"><Moon className="text-primary-blue w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-text-dark">QT Messages</h4>
              <p className="text-sm text-text-light">Write down daily messages God speaks to you. A perfect place for dream summaries and morning revelations.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="bg-primary-blue/10 w-fit p-3 rounded-xl"><Clock className="text-primary-blue w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-text-dark">Time Assessment</h4>
              <p className="text-sm text-text-light">Assess your daily commitment. This data feeds into your monthly Spiritometer graph.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="bg-primary-blue/10 w-fit p-3 rounded-xl"><BookOpen className="text-primary-blue w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-text-dark">Bible Verse</h4>
              <p className="text-sm text-text-light">Reflect on specific scriptures or your daily devotional text in this dedicated study space.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="bg-primary-blue/10 w-fit p-3 rounded-xl"><Lightbulb className="text-primary-blue w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-text-dark">Rhema Word</h4>
              <p className="text-sm text-text-light">Capture your own understanding of the Word; the explanation received directly from the Holy Spirit.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 lg:col-span-2">
              <div className="bg-accent-green/10 w-fit p-3 rounded-xl"><Sparkles className="text-accent-green w-6 h-6" /></div>
              <h4 className="font-bold text-lg text-text-dark">Personal Corner</h4>
              <p className="text-sm text-text-light">Identify new truths, claim promises, and record convictions or inspirations received throughout the day. Review your daily reflections here.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Church & Growth */}
        <div className="mb-32">
          <SectionTitle subtitle="Bridge your private devotion with corporate worship.">Growth & Community</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <FeatureCard 
              icon={Church}
              title="AT CHURCH"
              description="Document sermon notes with a special column for quoted verses. Accumulate your weekly time spent with God to arrive at the time spent for the week, which will be transferred to the monthly reflection page."
              className="border-l-4 border-l-primary-blue"
            />
          </div>
        </div>

        {/* Section 5: Reflections */}
        <div className="mb-32">
          <SectionTitle subtitle="Step back and see the bigger picture of what God is doing in your life.">Progress Reflections</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Monthly (EMR)", desc: "Spend time reflecting on the Lord's speaking throughout the month.", icon: RefreshCw },
              { title: "Quarterly (QR)", desc: "A deeper 3-month review of your spiritual journey.", icon: BarChart3 },
              { title: "Half-Year (HYR)", desc: "Assess 6 months of growth and milestones.", icon: BarChart3 },
              { title: "End of Year (EYR)", desc: "A full 12-month reflection on strides made.", icon: BarChart3 },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white/60 rounded-2xl border border-white hover:bg-white transition-colors">
                <item.icon className="w-8 h-8 text-primary-blue mb-4" />
                <h4 className="font-bold text-text-dark mb-2">{item.title}</h4>
                <p className="text-sm text-text-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Special Seasons */}
        <div className="mb-32">
          <SectionTitle subtitle="Dedicated spaces for the most holy times of the year.">Special Seasons</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={Sun}
              title="EASTER TRIDUUM"
              description="Three dedicated pages to capture your experiences during Easter conventions and the triduum."
            />
            <FeatureCard 
              icon={Gift}
              title="ADVENT & CHRISTMAS"
              description="Document your experiences and convictions during Christmas conventions and the Advent season."
            />
          </div>
        </div>

        {/* Section 7: Spiritometer */}
        <div className="mb-12 bg-primary-blue text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Spiritometer (Graph)</h2>
              <p className="text-xl opacity-90 font-light mb-8">
                The culmination of your journey. Use the plot guide to visualize your time spent with God month-over-month. See your average daily commitment at a glance.
              </p>
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md">Plot Guide Included</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md">Monthly Averages</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md">Spiritual Consistency</span>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm">
              <BarChart3 className="w-24 h-24 text-accent-green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
