import CONFIG from "./config.json";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    visible: false,
    message: {
      color: CONFIG.colors.black,
      message: ""
    }
  },
  reducers: {
    /** Actualiser la notification
     * ```
     * payload: (object) {
     *   color: (string) Code couleur de la couleur de fond
     *   text: (string) Text de la notification
     * }
     * ```
     */
    setNotification: (state, action) => {
      return {
        visible: true,
        message: {
          color: action.payload.message.color,
          text: action.payload.message.text
        }
      }
    },
  }
});

// Application Store
const storeSlice = createSlice({
  name: "store",
  initialState: {
    page: "home",
  },
  reducers: {
    /** Changement de page
     * ```
     * payload: (string) Nom de la page
     * ```
     * @param {object} state - State de l'application
     * @param {object} action - Action de changement de page
     * @returns {object} State de l'application
     * @memberof storeSlice
     * @method setPage
     * @static
     * @public
     * @example
     * ```
     * import { setPage } from "./redux";
     * store.dispatch(setPage("home"));
     * ```
    **/
    setPage: (state, action) => {
      state.page = action.payload;
      return state;
    },
  }
});

export const { setNotification } = notificationSlice.actions;
export const { 
  setPage,
} = storeSlice.actions;

export const store = configureStore({
  reducer: {
    notification: notificationSlice.reducer,
    store: storeSlice.reducer
  },
});