const BASE_URL = "https://kenneth-marvel-n2at3rsn5a-uc.a.run.app/api";
// const BASE_URL = "";

const API = {
  submitUsername: async (username) => {
    const response = await fetch(`${BASE_URL}/submit-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });
    const res = await response.json();
    return res;
  },

  selectCharacter: async (character, username) => {
    const response = await fetch(`${BASE_URL}/avenger/${character}`, {
      headers: {
        "X-Username": username,
      },
    });
    const res = await response.json();
    return res;
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
    const response = await fetch(`${BASE_URL}/security-submit`, {
      method: "POST",
      body: JSON.stringify({ userInput: input }),
      headers: {
        "X-Username": username,
      },
    });
    const res = response.text();
    return res;
  },
};

export default API;
