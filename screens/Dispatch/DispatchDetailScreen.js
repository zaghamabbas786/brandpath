import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { urlLastPart } from '../../utils/urlLastPart';
import { useIsFocused } from '@react-navigation/native';
import { barCodeAction, getShippingListRequest, setShippingTypeRequest, getDispatchListRequest, setDispatchRefNumber, clearDispatchRefNumber } from '../../actions/global';
import WebView from 'react-native-webview';
import { getEscalationPrintRequest } from '../../actions/escalation';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NestedPageHeader from '../../components/NestedPageHeader';

// Module-level Set to track processed actions (persists across component remounts)
const processedActions = new Set();
// Clear old entries after 5 minutes to prevent memory leak
const PROCESSED_ACTION_TTL = 5 * 60 * 1000;
const processedActionsTimestamps = new Map();

// Cleanup function to remove old entries
const cleanupProcessedActions = () => {
  const now = Date.now();
  const keysToDelete = [];
  
  processedActionsTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > PROCESSED_ACTION_TTL) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => {
    processedActions.delete(key);
    processedActionsTimestamps.delete(key);
  });
};

// Helper function to extract purchase order (invoice number) from HTML extraInfo
const extractPurchaseOrderFromHTML = (extraInfo) => {
  if (!extraInfo || typeof extraInfo !== 'string') return null;
  
  // Look for dl_purOrder class which contains the purchase order number
  const purOrderMatch = extraInfo.match(/class="dl_purOrder[^"]*"[^>]*>([^<]+)</);
  if (purOrderMatch && purOrderMatch[1]) {
    const purOrder = purOrderMatch[1].trim();
    console.log('📋 DispatchDetail - Extracted purchase order from HTML:', purOrder);
    return purOrder;
  }
  return null;
};

// Helper function to extract order ref from HTML extraInfo
const extractOrderRefFromHTML = (extraInfo) => {
  if (!extraInfo || typeof extraInfo !== 'string') return null;
  
  // Look for dl_ref class which contains the order reference
  const refMatch = extraInfo.match(/class="dl_ref[^"]*"[^>]*>([^<]+)</);
  if (refMatch && refMatch[1]) {
    const orderRef = refMatch[1].trim();
    console.log('📋 DispatchDetail - Extracted order ref from HTML:', orderRef);
    return orderRef;
  }
  return null;
};

// Memoized dropdown item component for better performance
const DropdownItem = React.memo(({ option, isSelected, onPress, styles }) => (
  <TouchableOpacity
    onPress={() => onPress(option)}
    activeOpacity={0.7}
    delayPressIn={0}
    style={[
      styles.dropdownItem,
      isSelected && styles.dropdownItemSelected,
    ]}
  >
    <Text
      style={[
        styles.dropdownItemText,
        isSelected && styles.dropdownItemTextSelected,
      ]}
    >
      {option}
    </Text>
  </TouchableOpacity>
));

const DispatchDetailScreen = ({
  Auth: { user, currentPage },
  Global: {
    screenDetail,
    currentUrl,
    screenHistoryUrl,
    globalLoading,
    globalCurrentPage,
    localCurrentPage,
    userState,
    errorText,
    message,
    error,
    shippingList,
    shippingListLoading,
    shippingListError,
    selectedShippingType,
    dispatchList,
    dispatchListLoading,
    dispatchListError,
    dispatchRefNumber,
  },
  getEscalationPrintRequest,
  scanBarcode,
  onBarcodeRefocus,
  getShippingList,
  setShippingType,
  getDispatchList,
  setDispatchRefNumber,
  clearDispatchRefNumber,
}) => {
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);
  const searchInputRef = useRef(null);
  const screenHistoryUrlRef = useRef(screenHistoryUrl);
  const isSearchFocusedRef = useRef(false);
  const allowBlurRef = useRef(false);
  const clearDispatchRefRef = useRef(clearDispatchRefNumber);
  const scanBarcodeRef = useRef(scanBarcode);
  const lastScannedBarcodeRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update refs when values change
  useEffect(() => {
    screenHistoryUrlRef.current = screenHistoryUrl;
  }, [screenHistoryUrl]);

  useEffect(() => {
    clearDispatchRefRef.current = clearDispatchRefNumber;
  }, [clearDispatchRefNumber]);

  useEffect(() => {
    scanBarcodeRef.current = scanBarcode;
  }, [scanBarcode]);

  // Fetch shipping list and dispatch list when component mounts
  useEffect(() => {
    if (user && user.username) {
      if (shippingList.length === 0 && !shippingListLoading) {
        getShippingList(user.username);
      }
      if (dispatchList.length === 0 && !dispatchListLoading) {
        getDispatchList(user.username);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - only run on mount

  // Transform shipping list data to dropdown options (remove "All" option)
  const dropdownOptions = React.useMemo(() => {
    if (!shippingList || shippingList.length === 0) {
      return [];
    }
    return shippingList.map(item => item.courierName);
  }, [shippingList]);

  // Initialize selected option from Redux or use first option
  useEffect(() => {
    if (dropdownOptions.length > 0) {
      // If there's a selected shipping type in Redux and it exists in options, use it
      if (selectedShippingType && dropdownOptions.includes(selectedShippingType)) {
        setSelectedOption(selectedShippingType);
      } else if (!selectedOption) {
        // Otherwise, if no local selection, use first option
        setSelectedOption(dropdownOptions[0]);
      } else if (!dropdownOptions.includes(selectedOption)) {
        // If current selection is no longer in the list, use first option
        setSelectedOption(dropdownOptions[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOptions, selectedShippingType]);

  // Group dispatch list by order reference (ref)
  const groupedDispatchList = React.useMemo(() => {
    if (!dispatchList || dispatchList.length === 0) {return [];}

    const grouped = dispatchList.reduce((acc, item) => {
      const existingGroup = acc.find(group => group.ref === item.ref);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({
          ref: item.ref,
          customerRef: item.customerRef,
          status: item.status,
          shippingType: item.shippingType,
          items: [item],
        });
      }
      return acc;
    }, []);

    return grouped;
  }, [dispatchList]);

  // Filter dispatch list based on debounced search query for better performance
  const filteredDispatchList = React.useMemo(() => {
    if (!debouncedSearchQuery.trim()) {return groupedDispatchList;}

    const query = debouncedSearchQuery.toLowerCase().trim();
    return groupedDispatchList.filter(group =>
      group.ref?.toLowerCase().includes(query) ||
      group.customerRef?.toLowerCase().includes(query)
    );
  }, [groupedDispatchList, debouncedSearchQuery]);

  // Clear dispatch ref number when screen loses focus
  useEffect(() => {
    if (!isFocused && dispatchRefNumber) {
      clearDispatchRefRef.current();
    }
  }, [isFocused, dispatchRefNumber]);

  // Auto-trigger print label when action completes (with safeguards against infinite loops)
  useEffect(() => {
    // Only process if screen is focused to prevent background processing
    if (!isFocused) return;
    
    if (screenDetail && screenDetail.action === 'COMPLETE' && screenDetail.page === 'DISPATCH') {
      // Create unique key for this action to prevent duplicate processing
      const actionKey = `${screenDetail.ref}-${screenDetail.param}-${screenDetail.barcode}`;
      
      // Cleanup old entries periodically
      cleanupProcessedActions();
      
      // Skip if we've already processed this action (module-level check persists across remounts)
      if (processedActions.has(actionKey)) {
        return;
      }
      
      // Mark this action as processed IMMEDIATELY to prevent race conditions
      // Using module-level Set that persists across component remounts
      processedActions.add(actionKey);
      processedActionsTimestamps.set(actionKey, Date.now());
      
      // Automatically trigger print label
      if (screenDetail.ref && screenDetail.param && user && user.username && userState) {
        let invoiceNum = screenDetail.param;
        let orderRef = screenDetail.ref;
        
        console.log('🔍 DispatchDetail - Initial values:', { invoiceNum, orderRef });
        
        // If param and ref are the same, try to extract correct values from HTML
        if (invoiceNum === orderRef && screenDetail.extraInfo) {
          console.log('⚠️ DispatchDetail - param and ref are identical, extracting from HTML...');
          
          const htmlPurOrder = extractPurchaseOrderFromHTML(screenDetail.extraInfo);
          const htmlOrderRef = extractOrderRefFromHTML(screenDetail.extraInfo);
          
          if (htmlPurOrder && htmlOrderRef && htmlPurOrder !== htmlOrderRef) {
            invoiceNum = htmlPurOrder;
            orderRef = htmlOrderRef;
            console.log('✅ DispatchDetail - Using values extracted from HTML:', { invoiceNum, orderRef });
          } else {
            console.warn('⚠️ DispatchDetail - Could not extract different values from HTML');
            console.warn('⚠️ Backend should provide different param (InvoiceNum) and ref (OrderRef) values');
          }
        }
        
        // For dispatch completion: ForceNewLabel=false, AdminMode=false
        const payload = {
          InvoiceNum: invoiceNum,
          OrderRef: orderRef,
          User: user.username,
          ForceNewLabel: false, // False for dispatch completion
          StationID: userState.stationid,
          Staging: false,
          AdminMode: false, // False for dispatch completion
        };
        
        console.log('🖨️ DispatchDetail - Auto-printing label with payload:', payload);
        
        // Use setTimeout to prevent immediate re-render issues
        setTimeout(() => {
          getEscalationPrintRequest(payload);
        }, 100);
      }
    }
  }, [screenDetail, user, userState, getEscalationPrintRequest, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      // Reset when screen loses focus
      lastScannedBarcodeRef.current = null;
      return;
    }

    let isMounted = true;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;

    if (
      isMounted &&
      currentUrl.includes('/api/dispatch/CMD.DISPATCH') &&
      currentUrl === lastUrlInHistory &&
      !screenDetail &&
      !globalLoading &&
      errorText === null
    ) {
      const lastPart = urlLastPart(lastUrlInHistory);

      // Prevent duplicate calls with same barcode
      if (lastScannedBarcodeRef.current === lastPart) {
        return;
      }

      lastScannedBarcodeRef.current = lastPart;

      const data = {
        userName: user.username,
        page: localCurrentPage
          ? localCurrentPage
          : globalCurrentPage
            ? globalCurrentPage
            : currentPage,
        barcode: lastPart,
        currentPage: lastPart,
      };

      scanBarcodeRef.current(data);
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, currentUrl, screenDetail, globalLoading, errorText, localCurrentPage, globalCurrentPage, currentPage]);

  const onMessage = event => {
    const code = event.nativeEvent.data;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);

    // Ensure orderInfo is an object before using it
    let orderInfo = screenDetail.orderInfo;
    if (typeof orderInfo === 'string') {
      try {
        orderInfo = JSON.parse(orderInfo);
      } catch (error) {
        console.error('[DispatchDetailScreen] Error parsing orderInfo:', error);
        orderInfo = {};
      }
    }

    // Handle print label commands
    if (code === 'CMD.PRINT.REPRINT_LABEL' || code === 'CMD.PRINT.NEW_LABEL') {
      const payload = {
        InvoiceNum: null, // Not required for dispatch
        OrderRef: orderInfo?.Ref || dispatchRefNumber,
        User: user.username,
        ForceNewLabel: code === 'CMD.PRINT.NEW_LABEL',
        StationID: userState.stationid,
        Courier: selectedOption || null,
        CustomsDocType: null,
        Staging: false,
        AdminMode: false,
      };

      getEscalationPrintRequest(payload);
    } else {
      const data = {
        userName: user.username,
        page: screenDetail.page,
        barcode: code,
        currentPage: lastPart,
      };

      scanBarcode(data);
    }
  };

  const injectedJS = `
  (function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.transition = 'opacity 0.2s';
      button.addEventListener('touchstart', function() {
        this.style.opacity = '0.6';
      });
      button.addEventListener('touchend', function() {
        this.style.opacity = '1';
      });
      button.addEventListener('touchcancel', function() {
        this.style.opacity = '1';
      });
    });
  })();
`;

  // Handle search focus - disable barcode scanner (following StockTakeScreen pattern)
  const handleSearchFocus = () => {
    // console.log("Search focused - disabling barcode");
    isSearchFocusedRef.current = true;
    allowBlurRef.current = false;
    setIsSearchFocused(true);
    if (onBarcodeRefocus) {
      onBarcodeRefocus(false);
    }
  };

  // Handle search blur - enable barcode scanner (following StockTakeScreen pattern)
  const handleSearchBlur = (e) => {
    // console.log("Search blur event - allowBlur:", allowBlurRef.current);

    // Only allow blur if explicitly requested (e.g., user clicked away)
    if (!allowBlurRef.current) {
      // console.log("Preventing automatic blur - refocusing search");
      e?.preventDefault?.();
      setTimeout(() => {
        if (searchInputRef.current && isSearchFocusedRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
      return;
    }

    // console.log("Allowing blur - enabling barcode");
    isSearchFocusedRef.current = false;
    allowBlurRef.current = false;
    setIsSearchFocused(false);
    if (onBarcodeRefocus) {
      onBarcodeRefocus(true);
    }
  };

  // Prevent barcode from stealing focus when search is active
  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      const focusInterval = setInterval(() => {
        if (isSearchFocusedRef.current && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 150);

      return () => clearInterval(focusInterval);
    }
  }, [isSearchFocused]);

  // Handle courier selection - optimized for immediate response
  const handleCourierSelection = useCallback((option) => {
    // Close dropdown immediately (before anything else)
    setDropdownVisible(false);

    // Update selection immediately
    setSelectedOption(option);

    // Queue API calls for next tick (non-blocking)
    requestAnimationFrame(() => {
      if (user && user.username) {
        setShippingType(user.username, option);
        // Refresh dispatch list after a delay
        setTimeout(() => {
          getDispatchList(user.username);
        }, 300);
      }
    });
  }, [user, setShippingType, getDispatchList, selectedOption]);

  // Memoized render function for dropdown items - now only depends on handler
  const renderDropdownItem = useCallback(({ item: option }) => (
    <DropdownItem
      option={option}
      isSelected={option === selectedOption}
      onPress={handleCourierSelection}
      styles={styles}
    />
  ), [selectedOption, handleCourierSelection]);

  // Memoized keyExtractor for dropdown
  const dropdownKeyExtractor = useCallback((item, index) => `${item}-${index}`, []);

  // Handle order click to show details - wrapped in useCallback for performance
  const handleOrderClick = useCallback((orderRef) => {
    setDispatchRefNumber(orderRef);
    const lastUrl = screenHistoryUrlRef.current[screenHistoryUrlRef.current.length - 1] || '';
    const barcodeData = {
      userName: user.username,
      page: localCurrentPage || globalCurrentPage || currentPage,
      barcode: 'REF.' + orderRef,
      currentPage: urlLastPart(lastUrl),
    };
    
    scanBarcode(barcodeData);
  }, [user.username, localCurrentPage, globalCurrentPage, currentPage, setDispatchRefNumber, scanBarcode]);

  // Memoized render function for FlatList items - optimized
  const renderDispatchItem = useCallback(({ item: group }) => {
    const statusBgColor = group.status === 'Ready to ship' ? styles.statusBadgeReady : styles.statusBadgeDefault;

    return (
      <TouchableOpacity
        style={styles.listItem}
        activeOpacity={0.7}
        onPress={() => handleOrderClick(group.ref)}
        delayPressIn={0}
        delayPressOut={0}
        delayLongPress={500}
      >
        <View pointerEvents="none" style={styles.itemHeader}>
          <Text style={styles.itemRef}>{group.ref}</Text>
          {group.status && (
            <View style={[styles.statusBadge, statusBgColor]}>
              <Text style={styles.statusText}>{group.status}</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemCustomerRef}>{group.customerRef}</Text>

        {/* Products in this order - limit to first 3 for performance */}
        <View pointerEvents="none" style={styles.productsContainer}>
          {group.items.slice(0, 3).map((product, index) => (
            <View key={`${product.sku}-${index}`} style={styles.productItem}>
              <Text style={styles.productDescription} numberOfLines={1}>
                {product.description}{product.qty > 1 ? `, (${product.qty})` : ', (1)'}, {product.shippingType}
              </Text>
            </View>
          ))}
          {group.items.length > 3 && (
            <Text style={styles.moreItemsText}>+{group.items.length - 3} more items</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleOrderClick]);

  // Optimized keyExtractor for FlatList - use unique ref instead of index
  const keyExtractor = useCallback((group) => group.ref, []);

  return (
    <View style={styles.container}>
      <NestedPageHeader
        pageName="Dispatch"
      />
      {/* Only show search bar and dispatch list when no order is selected */}
      {(!!dispatchRefNumber == false && screenDetail?.page == 'MAINMENU') ? (
        <>
          <View style={styles.searchContainer}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setDropdownVisible(!dropdownVisible)}
                style={styles.dropdownButton}
              >
                <Text style={styles.dropdownButtonText}>
                  {shippingListLoading ? 'Loading...' : (selectedOption || 'Select Courier')}
                </Text>
                {!shippingListLoading && (
                  <Icon
                    name={dropdownVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={20}
                    color="#383838"
                  />
                )}
              </TouchableOpacity>
              {dropdownVisible && (
                <View style={styles.dropdownWrapper}>
                  <FlatList
                    data={dropdownOptions}
                    style={styles.dropdownList}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={dropdownKeyExtractor}
                    renderItem={renderDropdownItem}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                    getItemLayout={(data, index) => ({
                      length: 48,
                      offset: 48 * index,
                      index,
                    })}
                  />
                </View>
              )}
            </View>

            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search by order ref..."
              placeholderTextColor="#9aa0a6"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              returnKeyType="search"
            />
          </View>

          {/* Dispatch List */}
          <View
            style={styles.listContainer}
            onStartShouldSetResponder={() => {
              if (isSearchFocusedRef.current) {
                // console.log("User clicked outside search - allowing blur");
                allowBlurRef.current = true;
                isSearchFocusedRef.current = false;
                if (searchInputRef.current) {
                  searchInputRef.current.blur();
                }
              }
              return false;
            }}
          >
            {filteredDispatchList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery.trim() ? 'No orders found matching your search' : 'No dispatch items found'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredDispatchList}
                keyExtractor={keyExtractor}
                renderItem={renderDispatchItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={true}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                windowSize={7}
                initialNumToRender={8}
                keyboardShouldPersistTaps="handled"
                getItemLayout={(data, index) => ({
                  length: 120,
                  offset: 120 * index,
                  index,
                })}
              />
            )}
          </View>
        </>
      ) : (
        /* WebView - Show when order is selected */
        <View style={{ flex: 1 }}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => clearDispatchRefNumber()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#1f6feb" />
            <Text style={styles.backButtonText}>Back to Orders</Text>
          </TouchableOpacity> */}

          <View style={styles.webviewContainer} pointerEvents={isSearchFocused ? 'none' : 'auto'}>
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
            ) : screenDetail ? (
              <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{
                  html: `
                <html>
                  <head>
                  <meta name="viewport" content="width=device-width, initial-scale=0.79, maximum-scale=0.79, user-scalable=no">
                  <style>
                   ${screenDetail.commonCss || ''}
                  </style>
                   </head>
                  <body>
                  ${screenDetail.extraInfo || ''}
                      </body>
                </html>
              `,
                }}
                injectedJavaScript={injectedJS}
                onMessage={onMessage}
                keyboardDisplayRequiresUserAction={false}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Waiting for order List...</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 11,
    zIndex: 1000,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 2000,
    marginBottom: 10,
  },
  dropdownButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    color: '#383838',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  dropdownWrapper: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 3000,
  },
  dropdownList: {
    minWidth: 140,
    maxHeight: 220,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    color: '#383838',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  dropdownItemSelected: {
    backgroundColor: '#F5F9FF',
  },
  dropdownItemTextSelected: {
    color: '#1f6feb',
    fontFamily: 'Poppins-Medium',
  },
  searchInput: {
    width: '100%',
    height: 39,
    color: '#383838',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderColor: '#E5E7EB',
  },
  webviewContainer: {
    flex: 1,
    zIndex: 1,
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
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#9ca3af',
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemRef: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#128912',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeReady: {
    backgroundColor: '#128912',
  },
  statusBadgeDefault: {
    backgroundColor: '#6b7280',
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: 'white',
  },
  itemCustomerRef: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
  },
  itemDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#4b5563',
    width: 90,
  },
  detailValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#1f2937',
    flex: 1,
  },
  productsContainer: {
    marginTop: 8,
  },
  productsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  productItem: {
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productSku: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#1f2937',
  },
  productTypeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#1e40af',
  },
  productDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  moreItemsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQty: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#4b5563',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1f6feb',
    marginLeft: 8,
  },
});

DispatchDetailScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  getShippingList: PropTypes.func.isRequired,
  setShippingType: PropTypes.func.isRequired,
  getDispatchList: PropTypes.func.isRequired,
  setDispatchRefNumber: PropTypes.func.isRequired,
  clearDispatchRefNumber: PropTypes.func.isRequired,
  onBarcodeRefocus: PropTypes.func,
  getEscalationPrintRequest: PropTypes.func,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
  getShippingList: getShippingListRequest,
  setShippingType: setShippingTypeRequest,
  getDispatchList: getDispatchListRequest,
  setDispatchRefNumber: setDispatchRefNumber,
  clearDispatchRefNumber: clearDispatchRefNumber,
  getEscalationPrintRequest,
})(DispatchDetailScreen);
