import { Star } from "lucide-react";

export default function AuthAside() {
  return (
    // hidden lg:block bg-appBlue p-12 xl:p-20 text-white relative lg:col-span-4
    <aside className="">
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-br-full" />
      <div className="relative z-20">
        <div className="mb-12">
          <h1 className="text-2xl font-light text-orange-500 tracking-wide ">
            HOTEL-VIP
          </h1>
          {/* <div className=" text-sm">Property Management System</div> */}
        </div>
        <div className="space-y-6">
          {/* <h2 className="text-2xl font-bold">
            Welcome to <br />
            HOTEL-VIP 
          </h2> */}
          <p className="text-lg text-white/80">
            Simplifying property management with a comprehensive, easy-to-use
            system that streamlines operations, boosts productivity, and
            enhances guest experiences.
          </p>
        </div>
        <div className="mt-24 space-y-6 hidden">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <blockquote className="text-lg">
            &#34;Simplee Absolute transformed the way we manage properties.
            It&lsquo;s intuitive, powerful, and helps us stay organized while
            improving guest satisfaction.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div>
              <div className="font-semibold">Shafi A</div>
              <div className="text-sm text-white/60">Co-Founder, Design.co</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-tl-full" />
    </aside>
  );
}
