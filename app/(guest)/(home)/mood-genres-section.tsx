import { Radio } from "lucide-react";

const MOCK_GENRES = [
  { id: "1", name: "Pop", color: "from-blue-500 to-blue-700" },
  { id: "2", name: "Hip Hop", color: "from-orange-500 to-red-600" },
  { id: "3", name: "R&B", color: "from-purple-500 to-pink-600" },
  { id: "4", name: "Electronic", color: "from-teal-400 to-emerald-600" },
  { id: "5", name: "Chill Vibes", color: "from-indigo-400 to-cyan-400" },
  { id: "6", name: "Acoustic", color: "from-amber-600 to-orange-700" },
];

type Props = {};

const MoodGenresSection = (props: Props) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Radio className="w-6 h-6 text-primary" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Tâm trạng & Thể loại
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOCK_GENRES.map((genre) => (
          <div
            key={genre.id}
            className={`h-24 rounded-lg bg-gradient-to-br ${genre.color} p-4 flex items-end cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md`}
          >
            <span className="font-bold text-white text-lg drop-shadow-md">
              {genre.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoodGenresSection;
