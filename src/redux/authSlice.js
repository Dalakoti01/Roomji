import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  user: null,
  ownersProfile : null,
  rentedProperties : [],
  sellingProperties : [],
  allServices : [],
  allShops : [],
  ownerRentedProperties : [],
  ownerSellingProperties :[],
  ownerAllServices : [],
  ownerAllShops : [],
  selectedProperty : null,
  allUsers : [],
  subscribedUsers : [],
  allFeedbacks : [],
  allAdminSupports : [],
  revenue : [],
  adminDashboard : {},
  adminRentedProperties : [],
  adminSellingProperties : [],
  adminAllServices : [],
  adminAllShops : [],
  adminReportedSellingProperties : [], 
  adminReportedRentedProperties : [],
  adminReportedShops : [],
  adminReportedServices : [],
  revenueRecords : {},
  savedProperty : {}

  
};
const authSlice = createSlice({
  name: "auth",
  initialState: intialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRentedProperties : (state,action) => {
      state.rentedProperties = action.payload;
    },
    setSellingProperties : (state,action) => {
      state.sellingProperties = action.payload
    },
    setAllServices : (state,action) => {
      state.allServices = action.payload
    },
    setAllShops : (state,action) => {
      state.allShops = action.payload
    },
    setOwnerRentedProperties : (state,action) => {
      state.ownerRentedProperties = action.payload
    },
    setOwnerSellingProperties : (state,action) => {
      state.ownerSellingProperties = action.payload
    },
    setOwnerAllServices : (state,action) => {
      state.ownerAllServices = action.payload
    },
    setOwnerAllShops : (state,action) => {
      state.ownerAllShops = action.payload
    },
    setSelectedProperty : (state,action) => {
      state.selectedProperty = action.payload
    },
    setOwnersProfile : (state,action) => {
      state.ownersProfile = action.payload
    },
    setAllUsers : (state,action) => {
      state.allUsers = action.payload
    },
    setAllSubscribedUsers : (state,action) => {
      state.subscribedUsers = action.payload
    },
    setAllFeedbacks : (state,action) => {
      state.allFeedbacks = action.payload
    },
    setAllAdminSupports : (state,action) => {
      state.allAdminSupports = action.payload
    },
    setRevenue : (state,action) => {
      state.revenue = action.payload
    },
    setAdminDashboard : (state,action) => {
      state.adminDashboard = action.payload
    },
    setAdminRentedProperties : (state,action) => {
      state.adminRentedProperties = action.payload
    },
    setAdminSellingProperties : (state,action) => {
      state.adminSellingProperties = action.payload
    },
    setAdminAllServices : (state,action) => {
      state.adminAllServices = action.payload
    },
    setAdminAllShops : (state,action) => {
      state.adminAllShops = action.payload
    },
    setAdminReportedSellingProperties : (state,action) => {
      state.adminReportedSellingProperties = action.payload
    },
    setAdminReportedRentedProperties : (state,action) => {
      state.adminReportedRentedProperties = action.payload
    },
    setAdminReportedServices : (state,action) => {
      state.adminReportedServices = action.payload
    },
    setAdminReportedShops : (state,action) => {
      state.adminReportedShops = action.payload
  },
  setRevenueRecords : (state,action)=> {
    state.revenueRecords = action.payload
  },
  setSavedProperty : (state,action) => {
    state.savedProperty = action.payload
  }
  },
});


export const {setUser,setRentedProperties,setRevenueRecords,setSellingProperties,setAllUsers,setAllSubscribedUsers,setAllFeedbacks,setAllAdminSupports,setRevenue,setAllServices,setAllShops,setOwnerRentedProperties,setOwnerSellingProperties,setOwnerAllServices,setOwnerAllShops,setSelectedProperty,setOwnersProfile,setAdminDashboard,setAdminRentedProperties,setAdminSellingProperties,setAdminAllServices,setAdminAllShops,setAdminReportedSellingProperties,setAdminReportedRentedProperties,setAdminReportedServices,setAdminReportedShops,setSavedProperty} = authSlice.actions;
export default authSlice.reducer;