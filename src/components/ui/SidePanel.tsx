import React from "react";
import { Menu } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  selectedParty: string;
  onPartyChange: (party: string) => void;
  onToggle: () => void;
}

const parties = ["SPD", "CDU", "GRÜNE", "DieLinke", "AFD", "FDP", "BSW"];

const SidePanel: React.FC<SidebarProps> = ({
  isOpen,
  selectedParty,
  onPartyChange,
  onToggle,
}) => {
  if (!isOpen) {
    return (
      <nav className="fixed top-0 left-0 mt-2 ml-4 z-40 rounded-full shadow-md shadow-gray-300">
        <button className="p-4 rounded-full bg-red-400 ">
          <Menu size={32} color="white" />
        </button>
      </nav>
    );
  }
  return (
    <nav className="fixed top-0 left-0  mt-2 ml-4 z-40 shadow-md shadow-gray-300">
      <main className="p-3 p bg-white rounded-md">
        <h2 className="text-2xl font-bold">Select Party</h2>
        <div>
          {parties.map((party) => (
            <label
              key={party}
              className="flex items-center space-x-2 cursor-pointer text-neutral-700 hover:text-neutral-900"
            >
              <input
                type="radio"
                name="party"
                value={party}
                checked={selectedParty === party}
                onChange={() => onPartyChange(party)}
              />
              <span>{party}</span>
            </label>
          ))}
        </div>
      </main>
    </nav>
  );
};

export default SidePanel;
