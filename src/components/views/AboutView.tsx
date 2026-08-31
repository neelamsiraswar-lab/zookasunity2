import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Building2, 
  Flame, 
  Sparkles, 
  Award, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Wine, 
  Leaf, 
  Droplet
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { aboutContent, adminSettings } = useStore();

  const [tourName, setTourName] = useState<string>('');
  const [tourEmail, setTourEmail] = useState<string>('');
  const [tourDate, setTourDate] = useState<string>('2026-09-12');
  const [tourGuests, setTourGuests] = useState<number>(2);
  const [tourType, setTourType] = useState<string>('Master Distiller Barrel Tasting Experience');
  const [tourBooked, setTourBooked] = useState<boolean>(false);

  const handleTourBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (tourName && tourEmail) {
      setTourBooked(true);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Heritage Grains & Spring Water',
      desc: 'Sourcing single-estate heirloom malted barley and limestone-rich mountain spring water for pristine purity.',
      icon: Leaf
    },
    {
      num: '02',
      title: 'Wild Yeast Fermentation',
      desc: 'Extended 96-hour open wooden washback fermentation generating complex fruit esters and rich lactic undertones.',
      icon: Droplet
    },
    {
      num: '03',
      title: 'Hand-Hammered Copper Stills',
      desc: 'Double distillation in bespoke Speyside copper pot stills for maximum ester refinement and silky texture.',
      icon: Flame
    },
    {
      num: '04',
      title: 'Microclimate Cask Aging',
      desc: 'Maturation in first-fill Spanish Pedro Ximénez, Oloroso, and charred American white oak casks.',
      icon: Wine
    },
    {
      num: '05',
      title: 'Single Cask Hand Bottling',
      desc: 'Non-chill filtered, naturally colored, and individually sealed with botanical beeswax and numbered labels.',
      icon: Sparkles
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 w-full max-w-full overflow-x-hidden">
      {/* Hero Story Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-600/30 rounded-full">
              <Building2 className="w-3.5 h-3.5" />
              Distillery Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 leading-tight">
              {aboutContent.heritageTitle}
            </h1>
            <p className="text-base text-amber-400 font-serif italic">
              "{aboutContent.heritageSubtitle}"
            </p>
            <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
              <p>{aboutContent.storyParagraph1}</p>
              <p>{aboutContent.storyParagraph2}</p>
              <p>{aboutContent.storyParagraph3}</p>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-stone-950">
                <img
                  src={aboutContent.copperPotImage}
                  alt="Zookas Unity Copper Pot Stills"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-stone-900 border border-amber-600/40 rounded-xl text-xs text-center shadow-lg whitespace-nowrap">
                <strong className="text-amber-400 font-serif block">Speyside Twin Copper Stills</strong>
                <span className="text-[10px] text-stone-400">Forged by Third-Generation Coppersmiths</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Step Craft Distillation Process */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">The Method</span>
          <h2 className="font-serif text-3xl font-bold text-stone-100">
            The Alchemy of Small-Batch Distillation
          </h2>
          <p className="text-xs text-stone-400">
            Every step is guided by human intuition, sensory analysis, and uncompromising reverence for wood chemistry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-600/40 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-amber-500/40">{step.num}</span>
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-serif text-sm font-bold text-stone-100">{step.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Master Distillers Gallery */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">The Artisans</span>
          <h2 className="font-serif text-3xl font-bold text-stone-100">
            Meet the Master Distillers
          </h2>
          <p className="text-xs text-stone-400">
            Over eight decades of combined distillation mastery across whiskies, bourbons, gins, and ancestral agaves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutContent.masterDistillers.map((distiller) => (
            <div
              key={distiller.id}
              className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden space-y-4 p-5 flex flex-col justify-between hover:border-amber-600/40 transition shadow-lg"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden border border-stone-700 bg-stone-950 mb-4">
                  <img
                    src={distiller.image}
                    alt={distiller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {distiller.role}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-100">
                    {distiller.name}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed pt-1">
                    {distiller.bio}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 space-y-1 text-xs">
                <p className="text-stone-400">
                  <strong>Mastery:</strong> <span className="text-amber-400">{distiller.experienceYears} Years</span>
                </p>
                <p className="text-stone-400 truncate">
                  <strong>Signature:</strong> <span className="text-stone-200">{distiller.signatureSpirit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Commitments */}
      <div className="p-8 sm:p-10 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-6">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-emerald-400" />
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Regenerative Distillation & Sustainability
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aboutContent.sustainabilityGoals.map((goal, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 bg-stone-950/60 rounded-xl border border-stone-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-stone-300 leading-relaxed">{goal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distillery Tour & Tasting Room Reservation */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-600/30 p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Visit The Bond House
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-100">
              Book a Private Cask Tasting Tour
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Step behind the heavy oak doors into our barrel houses. Taste directly from 25-year-old casks with our master distillers and experience live sensory profiling.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{aboutContent.distilleryAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{aboutContent.distilleryHours}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-950/80 p-6 sm:p-8 rounded-2xl border border-stone-800">
            {tourBooked ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-stone-100">Tasting Tour Reserved!</h3>
                <p className="text-xs text-stone-300">
                  Confirmation sent to <strong className="text-amber-400">{tourEmail}</strong> for {tourGuests} guests on {tourDate}.
                </p>
                <button
                  onClick={() => setTourBooked(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-200 text-xs rounded-lg"
                >
                  Book Another Tasting
                </button>
              </div>
            ) : (
              <form onSubmit={handleTourBooking} className="space-y-3.5">
                <h3 className="font-serif text-base font-bold text-stone-100">Reserve Tasting Room Passes</h3>
                
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Lord Arthur Sterling"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="arthur@cask.com"
                      value={tourEmail}
                      onChange={(e) => setTourEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Guests</label>
                    <select
                      value={tourGuests}
                      onChange={(e) => setTourGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value={1}>1 Guest ($45)</option>
                      <option value={2}>2 Guests ($80)</option>
                      <option value={4}>4 Guests VIP ($150)</option>
                      <option value={8}>Private Vault (8 Guests - $280)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">Experience Type</label>
                  <select
                    value={tourType}
                    onChange={(e) => setTourType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option>Master Distiller Barrel Tasting Experience</option>
                    <option>Copper Still Chemistry & Botanical Blending Workshop</option>
                    <option>VIP Single Cask Vertical (18-Yr to 25-Yr Tasting)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  Confirm Reservation Pass
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
