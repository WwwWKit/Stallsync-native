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
      console.log("📦 API response:", res.data);
      return res.data.message || null;
    } catch (err) {
      console.log("Error in get merchant:", err);
      return null;
    }
  },

  fetchImage: (filename) => {
    if (filename && typeof filename === "string" && filename.trim() !== "") {
      return `http://localhost:5040/api/document/detail?document=${filename}`;
    }
    return '';
  },
};

export const productAPI = {
  listProducts: async (query) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { search: query },
      });
      return res.data.message?.data || [];
    } catch (err) {
      console.error("Error in listProducts:", err);
      return [];
    }
  },

 listByType: async (type) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psprdtyp: type },
      });
      return res.data.message?.data  || [];
    } catch (err) {
      console.error("Error in filteringType:", err);
      return [];
    }
  },

  listByCategory: async (category) => {
    try {
      const res = await api.get("/psprdpar/list", {
        params: { psprdcat: category },
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
      return res.data.message || [];
    } catch (err) {
      console.error("Error in getProduct:", err);
      return null;
    }
  },

  getFilter: async (cat = true, type = true) => {
    try {
     const res = await api.get("/psprdpar/filter", {
      params: { cat, type }
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
    return '';
  },
};

export const cartAPI = {
  viewCart: async (query) => {
    try {
      const res = await api.get(
        `/psmbrcrt/list?s=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in list cart item:", err);
      return [];
    }
  },

  addCartItem: async (id) => {
    try {
      const res = await api.post(`/psmbrcrt/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
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
};

export const orderAPI = {
  listOrders: async (query) => {
    try {
      const res = await api.get(
        `/psordpar/list?s=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in list order:", err);
      return [];
    }
  },

  viewOrder: async (id) => {
    try {
      const res = await api.get(`/psordpar/detail?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in view order:", err);
      return [];
    }
  },

  createOrder: async (id) => {
    try {
      const res = await api.post(`/psordpar/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
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
  createTransaction: async (id) => {
    try {
      const res = await api.post(`/pstrxpar/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in create transaction:", err);
      return [];
    }
  },

  updateTransaction: async (id, status) => {
    try {
      const res = await api.post(`/pstrxpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update transaction:", err);
      return [];
    }
  },
};

// export const userAPI = {
//     getUser: async (id) => {
//       try {
//         const res = await api.get(`/psusrpar/detail?id=${id}`);
//         const data = await res.json();
//         return data.merchant || [];
//       } catch (err) {
//         console.log("Error in get user:", err);
//         return [];
//       }
//     },

//     createUser: async (id) => {
//       try {
//         const res = await api.post(`/psusrpar/create?id=${id}`);
//         const data = await res.json();
//         return data.merchant || [];
//       } catch (err) {
//         console.log("Error in create user:", err);
//         return [];
//       }
//     },

//     deleteUser: async (id) => {
//       try {
//         const res = await api.post(`/psusrpar/delete?id=${id}`);
//         const data = await res.json();
//         return data.merchant || [];
//       } catch (err) {
//         console.log("Error in delete user:", err);
//         return [];
//       }
//     },

//     updateUser: async (id, status) => {
//       try {
//         const res = await api.post(`/psusrpar/update?id=${id}&status=${status}`);
//         const data = await res.json();
//         return data.merchant || [];
//       } catch (err) {
//         console.log("Error in update user:", err);
//         return [];
//       }

//     }
// };

export const memberAPI = {
  getMember: async (id) => {
    try {
      const res = await api.get(`/psmbrpar/detail?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in get member:", err);
      return [];
    }
  },

  createMember: async (id) => {
    try {
      const res = await api.post(`/psmbrpar/create?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in create member:", err);
      return [];
    }
  },

  deleteMember: async (id) => {
    try {
      const res = await api.post(`/psmbrpar/delete?id=${id}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in delete member:", err);
      return [];
    }
  },

  updateMember: async (id, status) => {
    try {
      const res = await api.post(`/psmbrpar/update?id=${id}&status=${status}`);
      const data = await res.json();
      return data.merchant || [];
    } catch (err) {
      console.log("Error in update member:", err);
      return [];
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
