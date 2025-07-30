import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App";

test("renders game board and all cells", () => {
  render(<App />);
  // Board should have 9 buttons (empty at start)
  const cells = screen.getAllByRole("button", { name: /cell/i });
  expect(cells.length).toBe(9);
});

test("cell click marks X or O, alternates players, disables filled cells", () => {
  render(<App />);
  const cells = screen.getAllByRole("button", { name: /cell/i });
  // X starts
  fireEvent.click(cells[0]);
  expect(cells[0].textContent).toBe("X");
  // O next
  fireEvent.click(cells[1]);
  expect(cells[1].textContent).toBe("O");
  // X again
  fireEvent.click(cells[2]);
  expect(cells[2].textContent).toBe("X");
  // Filled cell can't be clicked again
  fireEvent.click(cells[0]); // should do nothing
  expect(cells[0].textContent).toBe("X");
});

test("displays winner status when X wins", () => {
  render(<App />);
  const cells = screen.getAllByRole("button", { name: /cell/i });

  // Simulate X winning first row
  fireEvent.click(cells[0]); // X
  fireEvent.click(cells[3]); // O
  fireEvent.click(cells[1]); // X
  fireEvent.click(cells[4]); // O
  fireEvent.click(cells[2]); // X wins
  expect(
    screen.getByText(/Player X wins!/i)
  ).toBeInTheDocument();
});

test("displays draw status", () => {
  render(<App />);
  const cells = screen.getAllByRole("button", { name: /cell/i });
  // Fill all: X O X  X O O  O X X (known draw pattern)
  [
    0, 1, 2, 4, 3, 5, 7, 6, 8
  ].forEach((idx) => fireEvent.click(cells[idx]));
  expect(
    screen.getByText(/draw/i)
  ).toBeInTheDocument();
});

test("reset game button clears board and status", () => {
  render(<App />);
  const cells = screen.getAllByRole("button", { name: /cell/i });
  fireEvent.click(cells[0]); // X
  fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
  // Board should now all be empty
  screen.getAllByRole("button", { name: /cell/i }).forEach((cell) =>
    expect(cell.textContent).toBe("")
  );
  expect(
    screen.getByText(/Next turn:/i)
  ).toBeInTheDocument();
});
