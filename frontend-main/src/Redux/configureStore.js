import { Dishes } from "./dishes"
import { Comments } from "./comments";
import { Leaders } from "./leaders";
import { Promotions } from "./promotions";
import { Favorites } from "./favorites";
import { Auth } from "./auth";
import { initialFeedback } from "./forms";
import { createForms } from "react-redux-form";
import { createStore,combineReducers,applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes : Dishes,
            comments : Comments,
            leaders : Leaders,
            promotions : Promotions,
            auth : Auth,
            favorites: Favorites,
            ...createForms({feedback : initialFeedback})
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
}