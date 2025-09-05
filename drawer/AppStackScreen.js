import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSnackbar} from '../context/SnackbarContext';
import {
  clearError as clearAuthError,
  clearMessage as clearAuthMessage,
} from '../actions/auth';
import {
  clearError as clearGlobalError,
  clearMessage as clearGlobalMessage,
} from '../actions/global';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import withUserInfo from '../hoc/withUserInfo';
// Screens
import HomeScreen from '../screens/HomeScreen';
import DispatchScreen from '../screens/Dispatch/DispatchScreen';
import GoodsInScreen from '../screens/GoodsIn/GoodsInScreen';
import ReturnsScreen from '../screens/Return/ReturnsScreen';
import InventoryControlScreen from '../screens/Inventory/InventoryControlScreen';
import EscalationScreen from '../screens/Escalation/EscalationScreen';
import SecurityScreen from '../screens/Security/SecurityScreen';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomHeader from '../components/CustomHeader';
import ScanDetailScreen from '../screens/ScanDetailScreen';

import DispatchDetailScreen from '../screens/Dispatch/DispatchDetailScreen';
import PaperlessDispatchScreen from '../screens/Dispatch/PaperlessDispatchScreen';
import PaperlessPickScreen from '../screens/Dispatch/PaperlessPickScreen';
import PickScreen from '../screens/Dispatch/PickScreen';

import DockToStockScreen from '../screens/GoodsIn/DockToStockScreen';
import CrossDockScreen from '../screens/GoodsIn/CrossDockScreen';
import GoogleGoodsInScreen from '../screens/GoodsIn/GoogleGoodsInScreen';
import StockMoveScreen from '../screens/Inventory/StockMoveScreen';
import StockTakeScreen from '../screens/Inventory/StockTakeScreen';
import ItemInformationScreen from '../screens/Inventory/ItemInformationScreen';
import SecurityCheckScreen from '../screens/Inventory/SecurityCheckScreen';
import ReplenishmentScreen from '../screens/Inventory/ReplenishmentScreen';
import LuxotticaScreen from '../screens/Return/Luxottica/LuxotticaScreen';
import RTSScreen from '../screens/Return/RTSScreen';
import RMAScreen from '../screens/Return/Luxottica/RMAScreen';
import NewLabelScreen from '../screens/Escalation/NewLabelScreen';
import RePrintLabelScreen from '../screens/Escalation/RePrintLabelScreen';
import IntermediateLabelScreen from '../screens/Escalation/IntermediateLabelScreen';
import StockLabelScreen from '../screens/Return/Luxottica/StockLabelScreen';
import RTVScreen from '../screens/Return/Luxottica/RTVScreen';
import {BackHandler} from 'react-native';
import {goBack} from '../actions/global';
import {useNavigation} from '@react-navigation/native';
import VersioningScreen from '../screens/VersioningScreen';
import {resetDockToStock} from '../actions/goodsIn';
import PalletBuilderScreen from '../screens/Inventory/PalletBuilderScreen';
import CartonBuilderScreen from '../screens/Inventory/CartonBuilderScreen';
import {clearStockMove} from '../actions/inventory';

const AppStack = createStackNavigator();

const AppStackScreen = ({
  Auth: {error: authError, message: authMessage, loading: authLoading},
  Global: {error: globalError, message: globalMessage, globalLoading},
  clrAuthError,
  clrAuthMessage,
  clrGlobalError,
  clrGlobalMessage,
  goBackAction,
  resetDockToStock,
  clearStockMove,
}) => {
  const navigation = useNavigation();
  const {handleSnackbarAndSound} = useSnackbar();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        // Navigate back if possible
        goBackAction();
        resetDockToStock();
        clearStockMove();
        navigation.goBack();
      }
      return true; // Prevent the default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [goBackAction, navigation, resetDockToStock, clearStockMove]);

  useEffect(() => {
    // Handle auth error and message
    if (authError) {
      handleSnackbarAndSound(authError, 'error');
      clrAuthError();
    } else if (authMessage) {
      handleSnackbarAndSound(authMessage, 'success');
      clrAuthMessage();
    }

    // Handle global error and message
    if (globalError) {
      handleSnackbarAndSound(globalError, 'error');
      clrGlobalError();
    } else if (globalMessage) {
      handleSnackbarAndSound(globalMessage, 'success');
      clrGlobalMessage();
    }
    // eslint-disable-next-line
  }, [authError, authMessage, globalError, globalMessage]);

  return (
    <>
      {(authLoading || globalLoading) && <Spinner visible={true} />}

      <AppStack.Navigator
        screenOptions={{
          header: () => <CustomHeader />,
          gestureEnabled: false,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}>
        <AppStack.Screen
          name="HomeScreen"
          component={withUserInfo(HomeScreen)}
        />
        <AppStack.Screen
          name="VersioningScreen"
          component={withUserInfo(VersioningScreen)}
        />
        <AppStack.Screen
          name="ScanDetailScreen"
          component={withUserInfo(ScanDetailScreen)}
        />
        <AppStack.Screen
          name="Dispatch"
          component={withUserInfo(DispatchScreen)}
        />
        <AppStack.Screen
          name="GoodsIn"
          component={withUserInfo(GoodsInScreen)}
        />
        <AppStack.Screen
          name="Returns"
          component={withUserInfo(ReturnsScreen)}
        />
        <AppStack.Screen
          name="InventoryControl"
          component={withUserInfo(InventoryControlScreen)}
        />
        <AppStack.Screen
          name="Escalation"
          component={withUserInfo(EscalationScreen)}
        />
        <AppStack.Screen
          name="Security"
          component={withUserInfo(SecurityScreen)}
        />

        {/* Dispatch screens*/}
        <AppStack.Screen
          name="DispatchDetail"
          component={withUserInfo(DispatchDetailScreen)}
        />
        <AppStack.Screen
          name="PaperlessDispatch"
          component={withUserInfo(PaperlessDispatchScreen)}
        />
        <AppStack.Screen
          name="PaperlessPick"
          component={withUserInfo(PaperlessPickScreen)}
        />
        <AppStack.Screen name="Pick" component={withUserInfo(PickScreen)} />

        {/* GoodsIn screens*/}
        <AppStack.Screen
          name="DockToStock"
          component={withUserInfo(DockToStockScreen)}
        />
        <AppStack.Screen
          name="CrossDock"
          component={withUserInfo(CrossDockScreen)}
        />
        <AppStack.Screen
          name="GoogleGoodsIn"
          component={withUserInfo(GoogleGoodsInScreen)}
        />

        {/* Inventory control screens*/}
        <AppStack.Screen
          name="StockMove"
          component={withUserInfo(StockMoveScreen)}
        />
        <AppStack.Screen
          name="StockTake"
          component={withUserInfo(StockTakeScreen)}
        />
        <AppStack.Screen
          name="Replenishment"
          component={withUserInfo(ReplenishmentScreen)}
        />
        <AppStack.Screen
          name="ItemInformation"
          component={withUserInfo(ItemInformationScreen)}
        />
        <AppStack.Screen
          name="SecurityCheck"
          component={withUserInfo(SecurityCheckScreen)}
        />
        <AppStack.Screen
          name="PalletBuilder"
          component={withUserInfo(PalletBuilderScreen)}
        />
        <AppStack.Screen
          name="CartonBuilder"
          component={withUserInfo(CartonBuilderScreen)}
        />
        {/* Returns screens*/}
        <AppStack.Screen
          name="Luxottica"
          component={withUserInfo(LuxotticaScreen)}
        />
        <AppStack.Screen name="RTS" component={withUserInfo(RTSScreen)} />

        {/* Returns/LuxotticaScreen screens*/}
        <AppStack.Screen name="RMACheck" component={withUserInfo(RMAScreen)} />
        <AppStack.Screen
          name="StockLabel"
          component={withUserInfo(StockLabelScreen)}
        />
        <AppStack.Screen name="RTV" component={withUserInfo(RTVScreen)} />

        {/* Escalation screens*/}

        <AppStack.Screen
          name="NewLabel"
          component={withUserInfo(NewLabelScreen)}
        />
        <AppStack.Screen
          name="RePrintLabel"
          component={withUserInfo(RePrintLabelScreen)}
        />
        <AppStack.Screen
          name="IntermediateLabel"
          component={withUserInfo(IntermediateLabelScreen)}
        />
      </AppStack.Navigator>
    </>
  );
};

AppStackScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  clrAuthError: PropTypes.func.isRequired,
  clrAuthMessage: PropTypes.func.isRequired,
  clrGlobalError: PropTypes.func.isRequired,
  clrGlobalMessage: PropTypes.func.isRequired,
  goBackAction: PropTypes.func.isRequired,
  resetDockToStock: PropTypes.func.isRequired,
  clearStockMove: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  clrAuthError: clearAuthError,
  clrAuthMessage: clearAuthMessage,
  clrGlobalError: clearGlobalError,
  clrGlobalMessage: clearGlobalMessage,
  goBackAction: goBack,
  resetDockToStock,
  clearStockMove,
})(AppStackScreen);
