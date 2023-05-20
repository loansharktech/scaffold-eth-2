import rootReducer from "./reducers";
import { Middleware, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useStore } from "react-redux";
import logger from "redux-logger";

export { actions } from "./reducers";

const modules: Middleware[] = [];

if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
  modules.push(logger);
}
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(modules),
});

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedStore = useStore;
export default store;

// @ts-ignore
if (typeof window !== "undefined" && window.Cypress) {
  // @ts-ignore
  window.store = store;
}
