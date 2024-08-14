const BASE_URL = "https://dd-demo-sg.one/api";
// const BASE_URL = "";

const API = {
  selectCharacter: async (name) => {
    const response = await fetch(`${BASE_URL}/avenger/${name}`);
    const res = await response.json();
    return res;
  },

  simulateAttack: async (path) => {
    const response = await fetch(`${BASE_URL}/${path}`);
    const res = await response.json();
    return {
      ...res,
      status: response.status,
    };
  },

  sqlInjection: async (input) => {
    const response = await fetch(`${BASE_URL}/security-submit`, {
      method: "POST",
      body: JSON.stringify({ userInput: input }),
    });
    const res = await response.json();
    return res;
  },
};

export default API;
