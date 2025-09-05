import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {
  getDockToStockRequest,
  setDocDataLogRequest,
} from '../../actions/goodsIn';
import DockToStockListItem from '../../components/DockToStockListItem';
import NestedPageHeader from '../../components/NestedPageHeader';
import Spinner from 'react-native-loading-spinner-overlay';

const DockToStockScreen = ({
  Auth: {user},
  GoodsIn: {dockToStockList},
  Global: {globalLoading, errorText},
  getDockToStock,
  setDocDataLog,
  onBarcodeRefocus,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dockToStockInputRef = useRef(null);

  useEffect(() => {
    if (!dockToStockList && !globalLoading && errorText === null) {
      getDockToStock(user.username);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (inputValue) {
      getDockToStock(user.username, inputValue); // Call the action with the input value
      onBarcodeRefocus(true);
      Keyboard.dismiss();
      setInputValue('');
    }
  };
  const handleRefresh = () => {
    getDockToStock(user.username); // Fetch the list without search value
    onBarcodeRefocus(false);
  };

  // Callback function for list item click
  const handleItemClick = item => {
    const currentDate = new Date().toISOString();

    setDocDataLog(user.username, item.poNum, currentDate, item.supplierPONum);
  };

  return (
    <View style={styles.container}>
      <NestedPageHeader pageName="Dock To Stock" />
      <>
        {errorText ? (
          <View style={styles.inputContainerView}>
            {Array.isArray(errorText) ? (
              errorText.map((msg, index) => (
                <Text key={index} style={styles.errorText}>
                  {msg}
                </Text>
              ))
            ) : (
              <Text style={styles.errorText}>{errorText}</Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                ref={dockToStockInputRef}
                style={[styles.input, isFocused && styles.focusedInput]}
                placeholder="Search dock to stock"
                placeholderTextColor="#767b7f"
                value={inputValue}
                onChangeText={text => setInputValue(text)}
                onFocus={() => {
                  onBarcodeRefocus(false);
                  setIsFocused(true);
                }}
              />
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={!inputValue}
                  style={[
                    styles.editButton,
                    !inputValue && styles.disabledButton,
                  ]}>
                  <LinearGradient
                    colors={['#0175b2', '#4b3d91']}
                    style={styles.iconGradient}>
                    <FontAwesome name="search" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled">
              {globalLoading ? (
                <Spinner visible={true} />
              ) : (
                <>
                  {dockToStockList && dockToStockList.length > 0 ? (
                    dockToStockList.map((item, index) => (
                      <DockToStockListItem
                        key={index}
                        item={item}
                        onClick={() => handleItemClick(item)}
                      />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No items found</Text>
                  )}
                </>
              )}

              {/* Refresh Button */}
              <View style={styles.refreshContainer}>
                <TouchableOpacity
                  onPress={handleRefresh}
                  style={styles.editButton}>
                  <LinearGradient
                    colors={['#0175b2', '#4b3d91']}
                    style={styles.iconGradient}>
                    <FontAwesome name="sync" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  inputContainerView: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    paddingVertical: 27,
    paddingHorizontal: 11,
    elevation: 0,
    shadowColor: 'transparent',
  },
  errorText: {
    color: '#767b7f',
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium', // Replace with your preferred font
    fontSize: 12,
    marginLeft: 10,
  },
  input: {
    height: 39,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    borderRadius: 20,
    color: '#383838',
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingHorizontal: 20,
  },
  focusedInput: {
    borderColor: '#1cae97',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
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
  disabledButton: {
    opacity: 0.6,
  },
  refreshContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#767b7f',
    marginTop: 20,
  },
});

DockToStockScreen.propTypes = {
  Global: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  GoodsIn: PropTypes.object.isRequired,
  getDockToStock: PropTypes.func.isRequired,
  setDocDataLog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
  GoodsIn: state.GoodsIn,
});

export default connect(mapStateToProps, {
  getDockToStock: getDockToStockRequest,
  setDocDataLog: setDocDataLogRequest,
})(DockToStockScreen);
