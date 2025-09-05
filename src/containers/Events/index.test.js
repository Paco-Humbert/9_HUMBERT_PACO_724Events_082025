// src/containers/Events/index.test.js
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Events from "./index";

const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },
    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Events />
      </DataProvider>
    );
    // Il y a plusieurs "avril" -> on utilise findAll et on asserte la longueur
    const months = await screen.findAllByText(/avril/i);
    expect(months.length).toBeGreaterThan(0); 
  });

  describe("and an error occured", () => {
    it("an error message is displayed", async () => {
      // Rejete la promesse 
      api.loadData = jest.fn().mockRejectedValueOnce(new Error("boom"));
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      // Attendre que l'état erreur remplace "loading"
      await waitFor(() =>
        expect(screen.getByText(/an error occured/i)).toBeInTheDocument()
      );
    });
  });

  describe("and we select a category", () => {
    it("an filtered list is displayed", async () => {
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );

      await screen.findByText("Forum #productCON"); // état initial visible

      // Ouvrir le select
      fireEvent.click(await screen.findByTestId("collapse-button-testid"));

      // Choisir "soirée entreprise"
      fireEvent.click((await screen.findAllByText(/soirée entreprise/i))[0]);

      // Vérifier le filtrage
      await screen.findByText("Conférence #productCON");
      expect(screen.queryByText("Forum #productCON")).not.toBeInTheDocument();
    });
  });

  describe("and we click on an event", () => {
    it("the event detail is displayed", async () => {
      api.loadData = jest.fn().mockReturnValue(data);
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );

      // Ouvrir la modale via clic sur la carte
      fireEvent.click(await screen.findByText("Conférence #productCON"));

      // Détails visibles
      await screen.findByText("24-25-26 Février");
      await screen.findByText("1 site web dédié");
    });
  });
});
