import { useEffect, useState } from "react";
import { Arrow, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "./style";


export function CustomSelect({ setSearchType } : {setSearchType: React.Dispatch<React.SetStateAction<string>>}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Sem filtro");

  const handleSelect = async (description: string) => {
    setSelectedValue(description);
    setIsOpen(false);
  };


  useEffect(() => {
    setSearchType(selectedValue)
  }, [selectedValue])

  return (
    <Dropdown>
      <DropdownToggle onClick={() => setIsOpen(!isOpen)}>
        <div className="infos">
          {selectedValue}
        </div>
        <Arrow />
      </DropdownToggle>
      {isOpen && (
        <DropdownMenu>
          <DropdownItem onClick={() => handleSelect("Sem filtro")}>
            Sem filtro
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Grass")}>
            Grass
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Fire")}>
            Fire
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Water")}>
            Water
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Rock")}>
            Rock
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Electric")}>
            Electric
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Steel")}>
            Steel
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Ground")}>
            Ground
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Ice")}>
            Ice
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Fighting")}>
            Fighting
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Bug")}>
            Bug
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Poison")}>
            Poison
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Psychic")}>
            Psychic
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Ghost")}>
            Ghost
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Dragon")}>
            Dragon
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Dark")}>
            Dark
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Fairy")}>
            Fairy
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Normal")}>
            Normal
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("Flying")}>
            Flying
          </DropdownItem>

        </DropdownMenu>
      )}
    </Dropdown>
  );
};