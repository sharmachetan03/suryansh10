import { useState } from "react";
import { toast } from "sonner";
import { Send, Radio, Users, StickyNote, Gamepad2, Check, X } from "lucide-react";

const PHONE = "919980011330"; // India country code + number

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Enter your GamerTag to join the lobby.");
      return;
    }
    setSending(true);
    const attendingText =
      attending === "yes"
        ? "Yes — Accepting Invitation"
        : "No — Regretfully Declining";

    const message =
      `🟢 RSVP for Suryansh's 10th Birthday!\n` +
      `Name: ${name.trim()}\n` +
      `Attending: ${attendingText}\n` +
      `Total Guests: ${guests}\n` +
      `Notes/Allergies: ${notes.trim() || "—"}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Lobby joined! Complete send in WhatsApp.");
    setTimeout(() => setSending(false), 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="rsvp-form"
      className="relative bg-[#0F0F0F] border border-[#2a2a2a] p-6 sm:p-8 corner-cut"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[#107C10]/15 border border-[#107C10]">
            <Gamepad2 className="w-5 h-5 text-[#1BE61B]" strokeWidth={2.4} />
          </div>
          <div>
            <p className="font-heading text-[10px] tracking-hud uppercase text-neutral-500">
              Multiplayer Lobby
            </p>
            <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
              Join Lobby · RSVP
            </h3>
          </div>
        </div>
        <span className="hud-tag hidden sm:inline-flex">Slot Open</span>
      </div>

      <div className="grid gap-5">
        {/* Name */}
        <div className="grid gap-2">
          <label
            className="font-heading text-[11px] tracking-hud uppercase text-neutral-400 flex items-center gap-2"
            htmlFor="rsvp-name"
          >
            <Radio className="w-3.5 h-3.5 text-[#1BE61B]" /> GamerTag · Guest Name
          </label>
          <input
            id="rsvp-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Uncle Arjun"
            data-testid="rsvp-name-input"
            className="w-full bg-[#0A0A0A] border border-[#2a2a2a] text-white placeholder-neutral-600 px-4 py-3.5 font-body focus:outline-none focus:border-[#107C10] focus:ring-1 focus:ring-[#107C10] transition-colors"
          />
        </div>

        {/* Attending radio */}
        <div className="grid gap-2">
          <label className="font-heading text-[11px] tracking-hud uppercase text-neutral-400 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#1BE61B]" /> Ready Up?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`cursor-pointer relative border px-4 py-3.5 flex items-center gap-3 transition-all ${
                attending === "yes"
                  ? "border-[#107C10] bg-[#107C10]/10"
                  : "border-[#2a2a2a] bg-[#0A0A0A] hover:border-[#444]"
              }`}
              data-testid="rsvp-attending-yes"
            >
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={attending === "yes"}
                onChange={() => setAttending("yes")}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  attending === "yes" ? "border-[#1BE61B]" : "border-neutral-600"
                }`}
              >
                {attending === "yes" && (
                  <span className="w-2 h-2 rounded-full bg-[#1BE61B] shadow-[0_0_8px_#1BE61B]" />
                )}
              </span>
              <div>
                <div className="font-heading text-sm font-bold uppercase tracking-wide text-white">
                  Accepting
                </div>
                <div className="text-[11px] text-neutral-500 font-body">Yes, I&apos;ll be there</div>
              </div>
            </label>
            <label
              className={`cursor-pointer relative border px-4 py-3.5 flex items-center gap-3 transition-all ${
                attending === "no"
                  ? "border-neutral-400 bg-neutral-500/10"
                  : "border-[#2a2a2a] bg-[#0A0A0A] hover:border-[#444]"
              }`}
              data-testid="rsvp-attending-no"
            >
              <input
                type="radio"
                name="attending"
                value="no"
                checked={attending === "no"}
                onChange={() => setAttending("no")}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  attending === "no" ? "border-neutral-300" : "border-neutral-600"
                }`}
              >
                {attending === "no" && (
                  <span className="w-2 h-2 rounded-full bg-neutral-200" />
                )}
              </span>
              <div>
                <div className="font-heading text-sm font-bold uppercase tracking-wide text-white">
                  Declining
                </div>
                <div className="text-[11px] text-neutral-500 font-body">Regretfully no</div>
              </div>
            </label>
          </div>
        </div>

        {/* Guest count */}
        <div className="grid gap-2">
          <label
            htmlFor="rsvp-guests"
            className="font-heading text-[11px] tracking-hud uppercase text-neutral-400 flex items-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-[#1BE61B]" /> Squad Size · Guests
          </label>
          <select
            id="rsvp-guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            data-testid="rsvp-guests-select"
            className="w-full bg-[#0A0A0A] border border-[#2a2a2a] text-white px-4 py-3.5 font-body focus:outline-none focus:border-[#107C10] focus:ring-1 focus:ring-[#107C10] transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%231BE61B' stroke-width='2' fill='none'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n} className="bg-[#0A0A0A]">
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="grid gap-2">
          <label
            htmlFor="rsvp-notes"
            className="font-heading text-[11px] tracking-hud uppercase text-neutral-400 flex items-center gap-2"
          >
            <StickyNote className="w-3.5 h-3.5 text-[#1BE61B]" /> Mission Notes · Food Allergies
          </label>
          <textarea
            id="rsvp-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any allergies or special notes? (optional)"
            data-testid="rsvp-notes-textarea"
            className="w-full bg-[#0A0A0A] border border-[#2a2a2a] text-white placeholder-neutral-600 px-4 py-3.5 font-body focus:outline-none focus:border-[#107C10] focus:ring-1 focus:ring-[#107C10] transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          data-testid="rsvp-submit-btn"
          className="mt-2 group relative bg-[#107C10] hover:bg-[#1BE61B] text-black font-heading text-sm font-bold uppercase tracking-hud px-8 py-4 corner-cut border border-transparent hover:shadow-[0_0_28px_rgba(27,230,27,0.55)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Send className="w-4 h-4" />
          {sending ? "Opening WhatsApp..." : "Submit RSVP via WhatsApp"}
        </button>

        <p className="text-[11px] text-neutral-500 font-body text-center -mt-1">
          Opens WhatsApp with your message pre-filled. Hit Send to complete.
        </p>
      </div>
    </form>
  );
}
