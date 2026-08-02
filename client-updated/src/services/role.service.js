import api from "./api";

const roleService = {
  getRoles: async () => {
    const { data } = await api.get("/roles");
    return data.data; // roles[]
  },
};

export default roleService;
