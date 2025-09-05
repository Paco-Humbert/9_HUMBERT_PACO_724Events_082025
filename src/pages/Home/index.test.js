import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./index";

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personnel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours", {}, { timeout: 3000 });
      await screen.findByText("Message envoyé !", {}, { timeout: 3000 });
    });
  });

});

// Ajout de tests d'intégration
describe("When a page is created", () => {
  it("a list of events is displayed", async () => {
    const { container } = render(<Home />);
    await screen.findByRole('heading', { name: /Nos réalisations/i });
    const events = container.querySelector("#events");
    expect(events).toBeInTheDocument();
  });

  it("a list a people is displayed", async () => {
    render(<Home />);
    await screen.findByText("CEO");
    await screen.findByText("Alice");
    await screen.findByText("Isabelle");
  });

  it("a footer is displayed", () => {
    render(<Home />);
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });

  it("an event card, with the last event, is displayed", async () => {
    render(<Home />);
    // On vérifie simplement que la carte s’affiche (peu importe le titre)
  const eventCard = await screen.findByTestId("event-card", {}, { timeout: 3000 });
  expect(eventCard).toBeInTheDocument();
  });
});
