const BASE_URL = "https://dd-demo-sg.one/api";
// const BASE_URL = "";

const API = {
  submitUsername: async (username) => {
    try {
      const response = await fetch(`${BASE_URL}/submit-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorBody = await response.text(); // safer than .json() if response isn't valid JSON
        throw new Error(`Server error: ${response.status} - ${errorBody}`);
      }

      const res = await response.json();
      return res;
    } catch (error) {
      // Log or report error
      console.error("submitUsername error:", error.message);
    }
  },

  selectCharacter: async (character, username) => {
    try {
      const response = await fetch(`${BASE_URL}/avenger/${character}`, {
        headers: {
          "X-Username": username,
        },
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorBody = await response.text(); // safer than .json() if response isn't valid JSON
        throw new Error(`Server error: ${response.status} - ${errorBody}`);
      }

      const res = await response.json();
      return res;
    } catch (error) {
      // Log or report error
      console.error("submitUsername error:", error.message);
    }
  },

  simulateAttack: async (path, username) => {
    const response = await fetch(`${BASE_URL}/${path}`, {
      headers: {
        "X-Username": username,
      },
    });
    const res = await response.text();
    return res;
  },

  sqlInjection: async (input, username) => {
    try {
      const response = await fetch(`${BASE_URL}/security-submit`, {
        method: "POST",
        body: JSON.stringify({ userInput: input }),
        headers: {
          "X-Username": username,
        },
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorBody = await response.text(); // safer than .json() if response isn't valid JSON
        throw new Error(`Server error: ${response.status} - ${errorBody}`);
      }

      const res = response.text();
      return res;
    } catch (error) {
      // Log or report error
      console.error("submitUsername error:", error.message);
      return error.message;
    }
  },
};

export default API;
