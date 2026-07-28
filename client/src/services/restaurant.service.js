import api from "./api";

const restaurantService = {
  getProfile: async () => {
    const { data } = await api.get("/restaurants/profile");
    return data.data; // restaurant
  },

  updateProfile: async (payload) => {
    const { data } = await api.put("/restaurants/profile", payload);
    return data.data; // restaurant
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    // Let the browser set the multipart boundary — overriding the client's
    // default JSON content-type header would strip it and break the upload.
    const { data } = await api.post("/restaurants/logo", formData, {
      headers: { "Content-Type": undefined },
    });
    return data.data; // { logo }
  },

  uploadBanner: async (file) => {
    const formData = new FormData();
    formData.append("banner", file);

    const { data } = await api.post("/restaurants/banner", formData, {
      headers: { "Content-Type": undefined },
    });
    return data.data; // { banner }
  },
};

export default restaurantService;
