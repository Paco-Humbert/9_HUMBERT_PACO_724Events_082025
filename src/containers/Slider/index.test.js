// src/containers/Slider/index.test.js
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Slider from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DBU-unsplash1.png",
      type: "conference",
    },
    {
      title: "World Gaming Day",
      description: "Evenement mondial autour du gaming",
      date: "2022-03-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DBU-unsplash1.png",
      type: "gaming",
    },
    {
      title: "World Farming Day",
      description: "Evenement mondial autour de la ferme",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DBU-unsplash1.png",
      type: "farming",
    },
  ],
};

describe("Slider (TDD)", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("pas de warning React sur les keys et 1 radio par item", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    api.loadData = jest.fn().mockReturnValue(data);

    const { container } = render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    await screen.findByText("World economic forum");

    // 1 radio par élément
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(
      data.focus.length
    );

    // aucun warning React (keys, controlled/uncontrolled, etc.)
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("ne bug pas quand data.focus est vide", async () => {
    api.loadData = jest.fn().mockReturnValue({ focus: [] });

    const { container } = render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    expect(container.querySelectorAll(".SlideCard").length).toBe(0);
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(0);
  });

  it("auto-advance boucle 0 → 1 → 2 → 0", async () => {
    jest.useFakeTimers();
    api.loadData = jest.fn().mockReturnValue(data);

    render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    await screen.findByText(/World economic forum/i);

    // tick 1 → slide 2
    jest.advanceTimersByTime(5000);
    expect(await screen.findByText(/World Gaming Day/i)).toBeInTheDocument();

    // tick 2 → slide 3
    jest.advanceTimersByTime(5000);
    expect(await screen.findByText(/World Farming Day/i)).toBeInTheDocument();

    // tick 3 → reboucle slide 1
    jest.advanceTimersByTime(5000);
    expect(await screen.findByText(/World economic forum/i)).toBeInTheDocument();
  });
});
