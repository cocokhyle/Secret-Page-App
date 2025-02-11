// __tests__/Home.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../app/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom"; // Ensure jest-dom matchers are available

// Mocking the Next.js router and next-auth signIn function
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock window.alert to prevent JSDOM error
beforeAll(() => {
  global.alert = jest.fn();
});

describe("Home Component", () => {
  let pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form with correct labels", () => {
    render(<Home />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("logs in with valid credentials", async () => {
    render(<Home />);

    // Mocking the signIn function to return no error
    signIn.mockResolvedValue({ error: null });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user4@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/secret-page-1");
    });
  });

  test("shows error message for invalid login", async () => {
    render(<Home />);

    // Mocking the signIn function to return an error
    signIn.mockResolvedValue({ error: "Invalid email or password" });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  test("registers a new user", async () => {
    render(<Home />);

    // Click "Register" to switch forms
    fireEvent.click(screen.getByText(/don’t have an account\? register/i));

    // Wait for register form to appear
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /register/i })
      ).toBeInTheDocument();
    });

    // Mock API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Registration Successful" }),
    });

    // Mock window.alert
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // Fill out registration form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    // Click Register button
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Ensure alert was called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Registration successful. Please log in."
      );
    });

    // Clean up mock
    window.alert.mockRestore();
  });

  test("displays error message on failed registration", async () => {
    render(<Home />);

    // Switch to registration form
    fireEvent.click(screen.getByText(/don’t have an account\? register/i));

    // Mock the API call for registration failure
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: "duplicate" }),
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "existinguser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/account is already registered/i)
      ).toBeInTheDocument();
    });
  });
});
