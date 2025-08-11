import React from "react";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const cardsData = [
    {
      image: "https://i.postimg.cc/qqKdprbX/aditya.jpg",
      name: "Aditya Sohal",
      handle: "@adityasohal",
      date: "July 17, 2025",
      quoteTitle: "Built the whole damn thing.",
      quote:
        "Frontend, backend, design, testing — you name it, I did it. The entire site runs on caffeine and my code. Solo mission, fully executed.",
    },
    {
      image: "https://i.postimg.cc/bNbzhx4c/saaransh.jpg",
      name: "Saaransh Majumdar",
      handle: "@saaranshwrites",
      date: "July 16, 2025",
      quoteTitle: "Was emotionally present.",
      quote:
        "Didn’t code, didn’t test — but I did ask ‘how’s it going’ sometimes. Moral support expert.",
    },
    {
      image: "https://i.postimg.cc/htjpmsnN/Whats-App-Image-2025-07-17-at-17-31-57-a4cd279f.jpg",
      name: "Ayush Kaushal",
      handle: "@ayushkaushal",
      date: "July 15, 2025",
      quoteTitle: "Reviewed vibes only.",
      quote:
        "Dropped some ‘Looks good bro’ during standups. Did not write a single line of code.",
    },
    {
      image: "https://i.postimg.cc/Y0Y9tqFZ/ananya.jpg", // Replace with real image URL
      name: "Ananya Gupta",
      handle: "@ananyagupta",
      date: "July 14, 2025",
      quoteTitle: "Wrote the documentation.",
      quote:
        "Detailed docs, clear instructions, and structured guidelines. Made sure no one had to guess how things worked.",
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
      <div className="flex gap-2">
        <img className="size-11 rounded-full object-cover" src={card.image} alt="User" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold">{card.name}</p>
            <svg
              className="mt-0.5"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                fill="#2196F3"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>

      <p className="text-sm py-2 text-sky-700 font-semibold">{card.quoteTitle}</p>
      <p className="text-sm py-1 text-gray-800">{card.quote}</p>

      <div className="flex items-center justify-between text-slate-500 text-xs mt-3">
        <div className="flex items-center gap-1">
          <span>Posted on</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-500"
          >
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="text-center py-20">
        <h2 className="text-slate-700 text-[42px] font-semibold">Loved by Creators</h2>
        <p className="text-gray-500 max-w-xl mx-auto mt-2">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      {[false, true].map((reverse, idx) => (
        <div
          key={idx}
          className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
          <div
            className={`marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5 ${reverse ? "marquee-reverse" : ""}`}
          >
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
        </div>
      ))}
    </>
  );
};

export default Testimonial;
