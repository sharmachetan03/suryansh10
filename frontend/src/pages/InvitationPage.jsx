import HeroHeader from "@/components/HeroHeader";
import RsvpForm from "@/components/RsvpForm";
import {
  MapPin,
  Calendar,
  Clock,
  Cake,
  UtensilsCrossed,
  DoorOpen,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const schedule = [
  {
    time: "12:00 PM",
    label: "Lobby Opens",
    sub: "Arrival & warm-up",
    icon: DoorOpen,
  },
  {
    time: "12:30 PM",
    label: "Level Up",
    sub: "Cake cutting ceremony",
    icon: Cake,
  },
  {
    time: "1:00 PM",
    label: "Refuel Station",
    sub: "Buffet Lunch",
    icon: UtensilsCrossed,
  },
];

export default function InvitationPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-neutral-900">
      {/* Hero */}
      <HeroHeader />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Section heading */}
        <div className="mb-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <span className="hud-tag mb-4" data-testid="section-tag">
              Mission Briefing
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-neutral-900 leading-tight">
              You are invited to
              <br />
              <span className="text-[#107C10] glow-flicker">
                Suryansh&apos;s Birthday Celebration
              </span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2 font-heading text-[11px] tracking-hud uppercase text-neutral-500">
            <Sparkles className="w-4 h-4 text-[#107C10]" /> Family &amp; Friends
            Only
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Message card — spans 2 cols */}
          <div
            className="lg:col-span-2 relative bg-white border border-neutral-200 p-6 sm:p-8 corner-cut shadow-sm"
            data-testid="message-card"
          >
            <span className="hud-tag mb-5">Message from the Family</span>
            <p className="font-body text-base sm:text-lg text-neutral-800 leading-relaxed">
              Our little boy{" "}
              <span className="text-[#107C10] font-semibold">Suryansh</span> is
              crossing a major milestone and entering the double digits! We are
              incredibly blessed to watch him turn{" "}
              <span className="text-[#107C10] font-semibold">10</span>, and his
              childhood journey wouldn&apos;t be complete without the love and
              blessings of our dear family and friends.
            </p>
            <p className="font-body text-base sm:text-lg text-neutral-700 leading-relaxed mt-4">
              We would be absolutely delighted and honored to have you join us
              to celebrate his special day over lunch. Your presence and
              blessings mean the world to Suryansh and our family.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 border border-neutral-200 bg-[#FAFAFA] px-4 py-3">
                <Calendar className="w-4 h-4 text-[#107C10] shrink-0" />
                <div>
                  <div className="font-heading text-[10px] tracking-hud uppercase text-neutral-500">
                    Date
                  </div>
                  <div className="font-body text-sm text-neutral-900">
                    Sunday · 26 July 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-neutral-200 bg-[#FAFAFA] px-4 py-3">
                <MapPin className="w-4 h-4 text-[#107C10] shrink-0" />
                <div>
                  <div className="font-heading text-[10px] tracking-hud uppercase text-neutral-500">
                    Venue
                  </div>
                  <a
                    href="https://maps.google.com/?cid=13547126924896073272"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="venue-link"
                    className="font-body text-sm text-neutral-900 hover:text-[#107C10] hover:underline underline-offset-2 decoration-[#107C10] transition-colors inline-flex items-center gap-1"
                  >
                    Desi Masala, RR Nagar, Bangalore
                    <ExternalLink className="w-3 h-3 text-[#107C10]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Player card / photo placeholder */}
          <div
            className="relative bg-white border border-neutral-200 p-6 corner-cut flex flex-col shadow-sm"
            data-testid="player-card"
          >
            <span className="hud-tag mb-5">Player Card</span>
            <div className="relative flex-1 aspect-[3/4] min-h-[340px] border border-neutral-200 bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0] overflow-hidden flex items-center justify-center">
              <img
                src={`${process.env.PUBLIC_URL || ""}/suryansh.jpg`}
                alt="Suryansh — Level 10 unlocked"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 22%" }}
                data-testid="suryansh-photo"
              />
              {/* Subtle green vignette overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#107C10]/12 via-transparent to-transparent" />
              {/* Corner brackets */}
              <div className="pointer-events-none absolute inset-2">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#107C10]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#107C10]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#107C10]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#107C10]" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-xl font-bold uppercase text-neutral-900 tracking-wide">
                  Suryansh
                </span>
                <span className="font-mono-hud text-[#107C10] text-sm font-semibold">
                  LVL 10
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-neutral-100 border border-neutral-200">
                <div className="h-full bg-gradient-to-r from-[#0A6A0A] to-[#107C10] w-full" />
              </div>
              <p className="mt-2 font-body text-[11px] text-neutral-500">
                XP maxed · Achievement unlocked
              </p>
            </div>
          </div>

          {/* Schedule tiles */}
          {schedule.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white border border-neutral-200 hover:border-[#107C10] transition-all p-6 corner-cut group shadow-sm hover:shadow-md"
                data-testid={`schedule-tile-${idx}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#107C10]/10 border border-[#107C10] group-hover:bg-[#107C10]/15 transition-colors">
                    <Icon className="w-5 h-5 text-[#107C10]" strokeWidth={2.2} />
                  </div>
                  <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-400">
                    T-{idx + 1}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-mono-hud text-[#107C10] text-sm font-semibold">
                    {item.time}
                  </span>
                </div>
                <h4 className="font-heading text-xl font-bold uppercase text-neutral-900 tracking-wide">
                  {item.label}
                </h4>
                <p className="font-body text-sm text-neutral-600 mt-1">
                  {item.sub}
                </p>
              </div>
            );
          })}

          {/* RSVP form spans full width */}
          <div className="lg:col-span-3">
            <RsvpForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-heading text-[11px] tracking-hud uppercase text-neutral-500">
            © Suryansh&apos;s 10th · Powered by Family Love
          </p>
          <p className="font-body text-xs text-neutral-500">
            See you at Desi Masala, RR Nagar · 26 July 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
