import {combineReducers} from 'redux';
import AuthReducer from './auth';
import GlobalReducer from './global';
import GoodsInReducer from './goodsIn';
import InventoryReducer from './inventory';

export default combineReducers({
  Auth: AuthReducer,
  Global: GlobalReducer,
  GoodsIn: GoodsInReducer,
  Inventory: InventoryReducer,
});
