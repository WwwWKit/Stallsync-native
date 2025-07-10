import api from "../constants/APIs";

export const merchantAPI = {
  listMerchants: async (query) => {
    try {
      const res = await api.get("/psmrcpar/list", {
        params: { search: query },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.log("Error in search:", err);
      return [];
    }
  },

  getMerchant: async (id) => {
    try {
      const res = await api.get("/psmrcpar/detail", {
        params: { id },
      });
      return res.data.message;
    } catch (err) {
      console.log("Error in get merchant:", err);
      return null;
    }
  },

  fetchImage: (filename) => {
    if (filename && typeof filename === "string" && filename.trim() !== "") {
      return `http://localhost:5040/api/document/detail?document=${filename}`;
    }
    return "";
  },
};

export const productAPI = {
  listProducts: async (query, params = {}) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { search: query,  limit: 50, ...params  },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in listProducts:", err);
      return [];
    }
  },

  listPersonalized: async () => {
    try {
      const res = await api.get("/psprdpar/listPersonalized");
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in listPersonalized:", err);
      return [];
    }
  },

   listLatest: async () => {
    try {
      const res = await api.get("/psprdpar/listLatest");
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in listLatest:", err);
      return [];
    }
  },

   listTrending: async () => {
    try {
      const res = await api.get("/psprdpar/listTrending");
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in listTrending:", err);
      return [];
    }
  },

  listByMerchant: async (id) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psmrcuid: id },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in list products by merchant:", err);
      return [];
    }
  },

  listByMerchantAndType: async (id, type) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psmrcuid: id, psprdtyp: type },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in list products by merchant and type:", err);
      return [];
    }
  },
  listByType: async (type, params = {}) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psprdtyp: type, ...params },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in filteringType:", err);
      return [];
    }
  },

  listByCategory: async (category, params = {}) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psprdcat: category, ...params },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in filteringCategory:", err);
      return [];
    }
  },

  getProduct: async (id) => {
    try {
      const res = await api.get("/psprdpar/detail", {
        params: { id },
      });
      return res.data.message;
    } catch (err) {
      console.error("Error in getProduct:", err);
      return null;
    }
  },

  getFilter: async (cat = true, type = true) => {
    try {
      const res = await api.get("/psprdpar/filter", {
        params: { cat, type },
      });
      return res.data.message || { categories: [], types: [] };
    } catch (err) {
      console.error("Error in filteringCatOrType:", err);
      return { categories: [], types: [] };
    }
  },

  fetchImage: (filename) => {
    if (filename && typeof filename === "string" && filename.trim() !== "") {
      return `http://localhost:5040/api/document/detail?document=${filename}`;
    }
    return "";
  },
};

export const cartAPI = {
  viewCart: async (id) => {
    try {
      const res = await api.get(`/psmbrcrt/list`, { params: { psmrcuid: id } });
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in list cart item:", err);
      return [];
    }
  },

  addCartItem: async (payload) => {
    try {
      const res = await api.post(`/psmbrcrt/create`, payload);
      return res.data;
    } catch (err) {
      console.log("Error in add cart item:", err);
      return [];
    }
  },

  deleteCartItem: async (id) => {
    try {
      const res = await api.post(`/psmbrcrt/delete?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in delete cart item:", err);
      return [];
    }
  },

  updateCartItem: async (id, quantity) => {
    try {
      const res = await api.post(`/psmbrcrt/update?id=${id}&qty=${quantity}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update cart item:", err);
      return [];
    }
  },

  listMerchant: async () => {
    try {
      const res = await api.get(`/psmbrcrt/listMerchant`);
      console.log("res", res);
      return res.data.message.data;
    } catch (error) {
      console.log("Error in list merchant:", error);
      return [];
    }
  },

  listCartItems: async (merchantid) => {
    try {
      const res = await api.get(`/psmbrcrt/cartItems`, {
        params: { psmrcuid: merchantid },
      });
      return res.data.message || [];
    } catch (error) {
      console.log("Error in list cart items:", error);
      return [];
    }
  },
};

export const orderAPI = {
  listOrders: async (query) => {
    try {
      const res = await api.get("/psordpar/list");
      return res.data.message?.data || [];
    } catch (err) {
      console.log("Error in list order:", err);
      return [];
    }
  },

  getOrder: async (id) => {
    try {
      const res = await api.get(`/psordpar/detail`, { params: { id } });
      return res.data.message;
    } catch (err) {
      console.log("Error in get order:", err);
      return [];
    }
  },

  createOrder: async (payload) => {
    try {
      const res = await api.post(`/psordpar/create`, payload);
      return res.data;
    } catch (err) {
      console.log("Error in create order:", err);
      return [];
    }
  },

  deleteOrder: async (id) => {
    try {
      const res = await api.post(`/psordpar/delete?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in delete order:", err);
      return [];
    }
  },

  updateOrder: async (id, status) => {
    try {
      const res = await api.post(`/psordpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update order:", err);
      return [];
    }
  },
};

//export const orderItemAPI = {};

export const reviewAPI = {
  listReviews: async (query) => {
    try {
      const res = await api.get(
        `/psordrvw/list?s=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in list reviews:", err);
      return [];
    }
  },

  getReview: async (id) => {
    try {
      const res = await api.get(`/psordrvw/detail?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in get review:", err);
      return [];
    }
  },

  createReview: async (id) => {
    try {
      const res = await api.post(`/psordrvw/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in create review:", err);
      return [];
    }
  },

  deleteReview: async (id) => {
    try {
      const res = await api.post(`/psordrvw/delete?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in delete review:", err);
      return [];
    }
  },

  updateReview: async (id, rating) => {
    try {
      const res = await api.post(`/psordrvw/update?id=${id}&rating=${rating}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update review:", err);
      return [];
    }
  },
};

export const transactionAPI = {
  createOffline: async (psorduid, pstrxamt) => {
    try {
      const res = await api.post("pstrxpar/createOffline", {
        psorduid: psorduid,
        pstrxamt: pstrxamt,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to create offline transaction:", error);
      return { error: true };
    }
  },

  createOnline: async (psorduid, pstrxamt, { returnUrl }) => {
    try {
      const res = await api.post("pstrxpar/createOnline", {
        psorduid: psorduid,
        pstrxamt: pstrxamt,
        returnUrl,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to create online transaction:", error);
      return { error: true };
    }
  },
};

export const userAPI = {
  getUser: async (id) => {
    try {
      const res = await api.get(`/psusrpar/detail`, {params: { psmbruid: id }});
      return res.data.message;
    } catch (err) {
      console.error("Failed to get user:", err);
      return null;
    }
  },

  createUser: async (payload) => {
    try {
      const res = await api.post(`/psusrprf/signup`, payload);

      return res.data;
    } catch (err) {
      console.error("Failed to create user:", err);
      return { error: true };
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await api.post(`/psusrpar/delete?id=${id}`);
      return data;
    } catch (err) {
      console.error("Failed to delete user:", err);
      return { error: true };
    }
  },

  updateUser: async (id, status) => {
    try {
      const res = await api.post(`/psusrpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to update user:", err);
      return { error: true };
    }
  },
};

export const memberAPI = {
  getMember: async (id) => {
    try {
      const res = await api.get(`/psmbrprf/detailMember`);
      return res.data.message;
    } catch (err) {
      console.error("Failed to get member:", err);
      return null;
    }
  },

  createMember: async (payload) => {
    try {
      const res = await api.post(`/psmbrprf/create`, payload);
      return res.data;
    } catch (err) {
      console.error("Failed to create member:", err);
      return { error: true };
    }
  },

  deleteMember: async (id) => {
    try {
      const res = await api.post(`/psmbrpar/delete?id=${id}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to delete member:", err);
      return { error: true };
    }
  },

  updateMember: async (id, status) => {
    try {
      const res = await api.post(`/psmbrpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to update member:", err);
      return { error: true };
    }
  },
};

export const rewardAPI = {
  listReward: async () => {
    try {
      const res = await api.get(`/psrwdpar/list`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in list voucher:", err);
      return [];
    }
  },

  getReward: async (id) => {
    try {
      const res = await api.get(`/psvchrpar/detail?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in get voucher:", err);
      return [];
    }
  },

  createReward: async (id) => {
    try {
      const res = await api.post(`/psvchrpar/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in create voucher:", err);
      return [];
    }
  },

  deleteReward: async (id) => {
    try {
      const res = await api.post(`/psvchrpar/delete?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in delete voucher:", err);
      return [];
    }
  },

  updateReward: async (id, status) => {
    try {
      const res = await api.post(`/psvchrpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update voucher:", err);
      return [];
    }
  },
};
