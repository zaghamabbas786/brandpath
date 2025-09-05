import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {barCodeAction} from '../actions/global';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import BarcodeModal from './BarcodeModal';
import LinearGradient from 'react-native-linear-gradient';
import {urlLastPart} from '../utils/urlLastPart';
import {resetDockToStock} from '../actions/goodsIn';
import {goBack} from '../actions/global';
import {clearStockMove} from '../actions/inventory';

const BarCodeReader = ({
  Auth: {user, currentPage},
  Global: {globalCurrentPage, currentUrl, localCurrentPage},
  scanBarcode,
  shouldRefocus,
  goBackAction,
  resetDockToStock,
  clearStockMove,
}) => {
  const navigation = useNavigation();
  const textInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [barcode, setBarcode] = useState('');
  const barcodeTimer = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state

  useFocusEffect(
    useCallback(() => {
      const handleFocus = () => {
        if (shouldRefocus && textInputRef.current && !isFocused) {
          setTimeout(() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }, 100);
        }
      };

      const unsubscribe = navigation.addListener('transitionEnd', handleFocus);

      // Call handleFocus initially when the screen is focused
      handleFocus();

      return () => {
        unsubscribe();
      };
    }, [navigation, isFocused, shouldRefocus]),
  );

  const handleBarcodeReadComplete = async barcodeValue => {
    const lastPart = urlLastPart(currentUrl);

    if (
      barcodeValue.toLowerCase() === 'cmd.back' &&
      lastPart !== 'CMD.ESCALATION' &&
      localCurrentPage !== 'ACCESSCONTROL' &&
      lastPart !== 'CMD.PPICK'
    ) {
      handleGoBack();
    } else {
      const data = {
        userName: user.username,
        page: localCurrentPage
          ? localCurrentPage
          : globalCurrentPage
          ? globalCurrentPage
          : currentPage,
        barcode: barcodeValue,
        currentPage: lastPart,
      };

      scanBarcode(data);
    }

    setBarcode('');
  };

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

  const handleTextInputChange = text => {
    setBarcode(text);

    if (barcodeTimer.current) {
      clearTimeout(barcodeTimer.current);
    }

    // Set a new timer to detect when typing has stopped
    barcodeTimer.current = setTimeout(() => {
      handleBarcodeReadComplete(text);
    }, 1000);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSave = () => {
    handleBarcodeReadComplete(barcode);
    Keyboard.dismiss();
    toggleModal(); // Close modal after saving
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={[styles.input, isFocused && styles.focusedInput]}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onChangeText={handleTextInputChange}
          showSoftInputOnFocus={false}
          value={barcode}
        />

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.editButton}>
            <LinearGradient
              colors={['#0175b2', '#4b3d91']}
              style={styles.iconGradient}>
              <FontAwesome name="pen" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for editing barcode */}
      <BarcodeModal
        visible={isModalVisible}
        onClose={toggleModal}
        barcode={barcode}
        onChange={setBarcode}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 39,
    flex: 1,
    color: '#383838',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  focusedInput: {
    borderColor: '#1cae97',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    borderRadius: 25, // Circular shape
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'absolute',
    right: -6,
  },
  iconGradient: {
    borderRadius: 20,
    padding: 6,
  },
});

BarCodeReader.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  goBackAction: PropTypes.func.isRequired,
  resetDockToStock: PropTypes.func.isRequired,
  clearStockMove: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});
export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
  goBackAction: goBack,
  resetDockToStock: resetDockToStock,
  clearStockMove,
})(BarCodeReader);
