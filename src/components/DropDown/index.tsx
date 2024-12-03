import { useEffect, useState } from "react";
import { Arrow, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "./style";


export function CustomSelect({ setSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("Sem filtro");

  const handleSelect = async (description: string) => {
    setSelectedValue(description);
    setIsOpen(false);
  };


  useEffect(() => {
    setSearch(selectedValue)
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
          <DropdownItem onClick={() => handleSelect("grass")}>
            grass
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("fire")}>
            fire
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("water")}>
            water
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("rock")}>
            rock
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("electric")}>
            electric
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("steel")}>
            steel
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("ground")}>
            ground
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("ice")}>
            ice
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("fighting")}>
            fighting
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("bug")}>
            bug
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("poison")}>
            poison
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("psychic")}>
            psychic
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("ghost")}>
            ghost
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("dragon")}>
            dragon
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("dark")}>
            dark
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("fairy")}>
            fairy
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("normal")}>
            normal
          </DropdownItem>
          <DropdownItem onClick={() => handleSelect("flying")}>
            flying
          </DropdownItem>

        </DropdownMenu>
      )}
    </Dropdown>
  );
};