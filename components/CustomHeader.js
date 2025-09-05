import {useNavigation, useNavigationState} from '@react-navigation/native';
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5'; // Import FontAwesome for icon
import {goBack} from '../actions/global';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {resetDockToStock} from '../actions/goodsIn';
import logoImage from '../assets/images/logo-v.png';
import {clearStockMove} from '../actions/inventory';

const {height} = Dimensions.get('window');

const CustomHeader = ({goBackAction, resetDockToStock, clearStockMove}) => {
  const navigation = useNavigation();
  const routes = useNavigationState(state => state.routes);
  const showBackButton = routes.length > 1;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      // Navigate back if possible
      goBackAction();
      resetDockToStock();
      clearStockMove();
      navigation.goBack();
    }
    return true; // Prevent the default back button behavior
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1cae97', '#0175b2', '#4b3d91']}
        style={styles.topView}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.headerContent}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <FontAwesome name="chevron-left" style={styles.backButtonIcon} />
            </TouchableOpacity>
          )}
          <Image source={logoImage} style={styles.logo} />
          <Text style={styles.logoText}>BrandHub</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.42,
    zIndex: -1, // Ensure it stays behind other components
  },
  topView: {
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    top: '5%',
    width: '100%',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontFamily: '18KhebratMusamimRegular',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 1,
  },
  backButtonIcon: {
    fontSize: 20,
    color: 'black',
  },
});

CustomHeader.propTypes = {
  goBackAction: PropTypes.func.isRequired,
  resetDockToStock: PropTypes.func.isRequired,
  clearStockMove: PropTypes.func.isRequired,
};

export default connect(null, {
  goBackAction: goBack,
  resetDockToStock: resetDockToStock,
  clearStockMove,
})(CustomHeader);
