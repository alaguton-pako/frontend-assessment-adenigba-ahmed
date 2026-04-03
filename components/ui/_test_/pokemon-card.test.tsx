import { render, screen } from "@testing-library/react";
import PokemonCard from "../pokemon-card";

describe("PokemonCard", () => {
  it("renders pokemon name and id correctly", () => {
    render(<PokemonCard name="pikachu" id={25} />);

    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("#025")).toBeInTheDocument();
  });

  it("has correct link href", () => {
    render(<PokemonCard name="bulbasaur" id={1} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/1");
  });

  it("applies priority prop to image", () => {
    render(<PokemonCard name="charizard" id={6} priority />);

    const image = screen.getByRole("img", { name: "charizard" });
    expect(image).toBeInTheDocument();
  });
});
