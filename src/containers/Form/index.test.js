import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    // correction typo "Personnel"
    await screen.findByText("Personnel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);
      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Correction pour laisser un laps de temps avant de trouver les élements
      await screen.findByText("En cours", {}, { timeout: 3000 });
      await screen.findByText("Envoyer",  {}, { timeout: 3000 });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
