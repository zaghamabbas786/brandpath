import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Keyboard, TouchableOpacity} from 'react-native';
import {
  getStartStockMoveRequest,
  getStockMoveQtyRequest,
  conformMoveToMasterLoc,
  getSetMasterLocRequest,
  getCancleStockMoveRequest,
  getMasterLocRequest,
} from '../../actions/inventory';
import {useIsFocused} from '@react-navigation/native';
import NestedPageHeader from '../../components/NestedPageHeader';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {urlLastPart} from '../../utils/urlLastPart';
import {barCodeAction} from '../../actions/global';
import StockMoveModal from '../../components/StockMoveModal';

const StockMoveScreen = ({
  Auth: {user, currentPage},
  Inventory: {
    startStockMove,
    stockMoveDetail,
    extraInfo,
    conformMove,
    conformSetMasterLoc,
    setMasterLocText,
  },
  Global: {
    globalLoading,
    screenHistoryUrl,
    localCurrentPage,

    globalCurrentPage,
    errorText,
  },
  startStockMoveRequest,
  stockMoveQtyRequest,
  onBarcodeRefocus,
  scanBarcode,
  conformMoveToMasterLoc,
  getSetMasterLocRequest,
  getCancleStockMoveRequest,
  getMasterLocRequest,
}) => {
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState({
    sourceloc: false,
    sku: false,
    qty: false,
    destloc: false,
  });

  const [formData, setFormData] = useState({
    sourceloc: stockMoveDetail?.[0]?.sourceLoc || '',
    sku: stockMoveDetail?.[0]?.sku || '',
    qty: stockMoveDetail?.[0]?.qty || 0,
    destloc: stockMoveDetail?.[0]?.destLoc || '',
  });

  // Separate state for destloc so that user-entered value is preserved.
  const [destloc, setDestloc] = useState('');

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    if (isMounted && !startStockMove && !globalLoading && errorText === null) {
      startStockMoveRequest(user.username);
    }
    return () => {
      isMounted = false; // Clean up flag on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {}, [formData, destloc]);

  const handleSearch = (field, value) => {
    if (field === 'destloc') {
      setDestloc(value);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [field]: field === 'qty' ? parseInt(value, 10) || 0 : value,
      }));
    }

    if (field !== 'qty') {
      const lastUrlInHistory =
        screenHistoryUrl.length > 0
          ? screenHistoryUrl[screenHistoryUrl.length - 1]
          : null;

      const lastPart = urlLastPart(lastUrlInHistory);

      const data = {
        userName: user.username,
        page: localCurrentPage
          ? localCurrentPage
          : globalCurrentPage
          ? globalCurrentPage
          : currentPage,
        barcode: value,
        currentPage: lastPart,
      };

      scanBarcode(data);
    } else {
      stockMoveQtyRequest(user.username, value);
    }
    onBarcodeRefocus(true);
    Keyboard.dismiss();
  };
  const handleConfirmMove = () => {
    if (!conformMove) {
      const lastUrlInHistory =
        screenHistoryUrl.length > 0
          ? screenHistoryUrl[screenHistoryUrl.length - 1]
          : null;

      const lastPart = urlLastPart(lastUrlInHistory);

      const data = {
        userName: user.username,
        page: localCurrentPage
          ? localCurrentPage
          : globalCurrentPage
          ? globalCurrentPage
          : currentPage,
        barcode: stockMoveDetail?.[0]?.destLoc,
        currentPage: lastPart,
      };

      scanBarcode(data);

      const newMasterLocationText = `Move Complete: ${stockMoveDetail?.[0]?.qty} units of ${stockMoveDetail?.[0]?.sku} moved from ${stockMoveDetail?.[0]?.sourceLoc} to ${stockMoveDetail?.[0]?.destLoc}`;

      conformMoveToMasterLoc(newMasterLocationText);
    } else {
      getSetMasterLocRequest(user.username);
    }
  };

  const handleCancelMove = () => {
    if (!conformMove) {
      getCancleStockMoveRequest(user.username);
    } else {
      getMasterLocRequest(user.username);
    }
  };
  return (
    <View style={styles.container}>
      <NestedPageHeader pageName="Stock Move" />
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
            {startStockMove && (
              <>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      setModalVisible(prev => ({...prev, sourceloc: true}))
                    }
                    style={styles.modalInput}>
                    <Text
                      style={{color: formData.sourceloc ? '#000' : '#767b7f'}}>
                      {formData.sourceloc || 'Enter Source Location'}
                    </Text>

                    <View style={styles.iconContainer}>
                      <LinearGradient
                        colors={['#0175b2', '#4b3d91']}
                        style={styles.iconGradient}>
                        <FontAwesome name="pen" size={20} color="#fff" />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                <StockMoveModal
                  visible={modalVisible.sourceloc}
                  onClose={() =>
                    setModalVisible(prev => ({...prev, sourceloc: false}))
                  }
                  value={formData.sourceloc}
                  onSave={newValue => {
                    handleSearch('sourceloc', newValue);
                  }}
                />
                {(stockMoveDetail && stockMoveDetail[0]?.sourceLoc) ||
                conformMove ? (
                  <>
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          setModalVisible(prev => ({...prev, sku: true}))
                        }
                        style={styles.modalInput}>
                        <Text
                          style={{color: formData.sku ? '#000' : '#767b7f'}}>
                          {formData.sku || 'Enter SKU'}
                        </Text>

                        <View style={styles.iconContainer}>
                          <LinearGradient
                            colors={['#0175b2', '#4b3d91']}
                            style={styles.iconGradient}>
                            <FontAwesome name="pen" size={20} color="#fff" />
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <StockMoveModal
                      visible={modalVisible.sku}
                      onClose={() =>
                        setModalVisible(prev => ({...prev, sku: false}))
                      }
                      value={formData.sku}
                      onSave={newValue => {
                        handleSearch('sku', newValue);
                      }}
                    />
                  </>
                ) : null}

                {(stockMoveDetail && stockMoveDetail[0]?.sku) || conformMove ? (
                  <>
                    <Text style={styles.skuText}>
                      {stockMoveDetail?.[0].sku}
                    </Text>
                    <Text style={styles.productDescriptionText}>
                      {stockMoveDetail?.[0].description}
                    </Text>

                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          setModalVisible(prev => ({...prev, qty: true}))
                        }
                        style={styles.modalInput}>
                        <Text
                          style={{color: formData.qty ? '#000' : '#767b7f'}}>
                          {formData.qty || 'Enter Quantity'}
                        </Text>

                        <View style={styles.iconContainer}>
                          <LinearGradient
                            colors={['#0175b2', '#4b3d91']}
                            style={styles.iconGradient}>
                            <FontAwesome name="pen" size={20} color="#fff" />
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <StockMoveModal
                      visible={modalVisible.qty}
                      onClose={() =>
                        setModalVisible(prev => ({...prev, qty: false}))
                      }
                      value={formData.qty}
                      onSave={newValue => {
                        handleSearch('qty', newValue);
                      }}
                    />

                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          setModalVisible(prev => ({...prev, destloc: true}))
                        }
                        style={styles.modalInput}>
                        <Text
                          style={{
                            color: formData.destloc ? '#000' : '#767b7f',
                          }}>
                          {formData.destloc || 'Enter Destination Location'}
                        </Text>

                        <View style={styles.iconContainer}>
                          <LinearGradient
                            colors={['#0175b2', '#4b3d91']}
                            style={styles.iconGradient}>
                            <FontAwesome name="pen" size={20} color="#fff" />
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <StockMoveModal
                      visible={modalVisible.destloc}
                      onClose={() =>
                        setModalVisible(prev => ({...prev, destloc: false}))
                      }
                      value={formData.destloc}
                      onSave={newValue => handleSearch('destloc', newValue)}
                    />
                    {conformSetMasterLoc ? (
                      <>
                        <Text style={[styles.detailText, {color: '#0175b2'}]}>
                          {setMasterLocText || ''}
                        </Text>
                        <View style={styles.inputContainer}>
                          <TouchableOpacity
                            onPress={() => startStockMoveRequest(user.username)}
                            style={{width: '100%'}}>
                            <LinearGradient
                              colors={['#0175b2', '#4b3d91']}
                              style={styles.buttonGradient}>
                              <View style={styles.buttonContent}>
                                <Text
                                  style={[
                                    styles.buttonText,
                                    {paddingHorizontal: 0},
                                  ]}>
                                  Ok
                                </Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.detailText}>
                          {extraInfo
                            ? extraInfo
                            : stockMoveDetail?.[0]?.destLoc
                            ? `Move ${stockMoveDetail?.[0]?.qty} units of ${stockMoveDetail?.[0]?.sku} to ${stockMoveDetail?.[0]?.destLoc}?`
                            : stockMoveDetail?.[1]?.description}
                        </Text>

                        {(stockMoveDetail && stockMoveDetail[0]?.destLoc) ||
                        conformMove ? (
                          <>
                            <View style={styles.inputContainer}>
                              <TouchableOpacity
                                onPress={handleConfirmMove}
                                style={{width: '100%'}}>
                                <LinearGradient
                                  colors={['#0175b2', '#4b3d91']}
                                  style={styles.buttonGradient}>
                                  <View style={styles.buttonContent}>
                                    <Text
                                      style={[
                                        styles.buttonText,
                                        {paddingHorizontal: 0},
                                      ]}>
                                      Yes
                                    </Text>
                                  </View>
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                              <TouchableOpacity
                                onPress={handleCancelMove}
                                style={{width: '100%'}}>
                                <LinearGradient
                                  colors={['#0175b2', '#4b3d91']}
                                  style={styles.buttonGradient}>
                                  <View style={styles.buttonContent}>
                                    <Text
                                      style={[
                                        styles.buttonText,
                                        {paddingHorizontal: 0},
                                      ]}>
                                      No
                                    </Text>
                                  </View>
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}
              </>
            )}
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
  modalInput: {
    height: 39,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    borderRadius: 20,
    color: '#383838',
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
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
    right: 3,
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
  productDescriptionText: {
    fontFamily: 'Poppins-Regular',
    color: '#0175b2',
    fontSize: 14,

    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  skuText: {
    fontFamily: 'Poppins-Regular',
    color: '#1cae97',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    color: '#383838',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
    paddingHorizontal: 12, // Add horizontal padding for the text
    textAlign: 'center', // Ensure text is centered even when it wraps
  },
});
StockMoveScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  Inventory: PropTypes.object.isRequired,
  startStockMoveRequest: PropTypes.func.isRequired,
  stockMoveQtyRequest: PropTypes.func.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  conformMoveToMasterLoc: PropTypes.func.isRequired,
  getSetMasterLocRequest: PropTypes.func.isRequired,
  getCancleStockMoveRequest: PropTypes.func.isRequired,
  getMasterLocRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
  Inventory: state.Inventory,
});

export default connect(mapStateToProps, {
  startStockMoveRequest: getStartStockMoveRequest,
  stockMoveQtyRequest: getStockMoveQtyRequest,
  scanBarcode: barCodeAction,
  conformMoveToMasterLoc: conformMoveToMasterLoc,
  getSetMasterLocRequest: getSetMasterLocRequest,
  getCancleStockMoveRequest: getCancleStockMoveRequest,
  getMasterLocRequest: getMasterLocRequest,
})(StockMoveScreen);
