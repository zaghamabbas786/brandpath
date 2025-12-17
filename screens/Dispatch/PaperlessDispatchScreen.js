import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {urlLastPart} from '../../utils/urlLastPart';
import {useIsFocused} from '@react-navigation/native';
import {barCodeAction} from '../../actions/global';
import WebView from 'react-native-webview';
import {Text, View, StyleSheet} from 'react-native';
import {getEscalationPrintRequest} from '../../actions/escalation';
import {getMiscLabelPrintRequest} from '../../actions/miscLabel';

// Module-level Set to track processed actions (persists across component remounts)
// This prevents duplicate processing when component re-renders
const processedActionsPaperless = new Set();
const processedActionsTimestampsPaperless = new Map();

// Cleanup old processed actions (older than 5 minutes)
const PROCESSED_ACTION_TTL = 5 * 60 * 1000;

const cleanupProcessedActionsPaperless = () => {
  const now = Date.now();
  const keysToDelete = [];
  
  processedActionsTimestampsPaperless.forEach((timestamp, key) => {
    if (now - timestamp > PROCESSED_ACTION_TTL) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => {
    processedActionsPaperless.delete(key);
    processedActionsTimestampsPaperless.delete(key);
  });
};

// Helper function to extract purchase order (invoice number) from HTML extraInfo
const extractPurchaseOrderFromHTML = (extraInfo) => {
  if (!extraInfo || typeof extraInfo !== 'string') return null;
  
  const purOrderMatch = extraInfo.match(/class="dl_purOrder[^"]*"[^>]*>([^<]+)</);
  if (purOrderMatch && purOrderMatch[1]) {
    return purOrderMatch[1].trim();
  }
  return null;
};

// Helper function to extract order ref from HTML extraInfo
const extractOrderRefFromHTML = (extraInfo) => {
  if (!extraInfo || typeof extraInfo !== 'string') return null;
  
  const refMatch = extraInfo.match(/class="dl_ref[^"]*"[^>]*>([^<]+)</);
  if (refMatch && refMatch[1]) {
    return refMatch[1].trim();
  }
  return null;
};

const PaperlessDispatchScreen = ({
  Auth: {user, currentPage},
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
  },
  getEscalationPrintRequest,
  getMiscLabelPrintRequest,
  scanBarcode,
}) => {
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);

  // Listen for print action success
  useEffect(() => {
    // Only process if focused to prevent background updates
    if (!isFocused) return;
    
    if (message) {
      // Print action completed successfully
    }
  }, [message, isFocused]);

  // Listen for print action errors
  useEffect(() => {
    // Only process if focused to prevent background updates
    if (!isFocused) return;
    
    if (error) {
      // Print action failed - error logged to database
    }
  }, [error, errorText, isFocused]);

  // Auto-trigger misc label print when action is MISC.LABEL (with safeguards against infinite loops)
  useEffect(() => {
    if (!isFocused) return;
    
    // param contains the OrderRef value (e.g., "1651")
    if (screenDetail && screenDetail.action === 'MISC.LABEL' && screenDetail.param && userState && user && user.username) {
      // Create unique key for this action to prevent duplicate processing
      const actionKey = `MISC.LABEL-${screenDetail.ref}-${screenDetail.param}-${screenDetail.barcode}`;
      
      // Cleanup old entries periodically
      cleanupProcessedActionsPaperless();
      
      // Skip if we've already processed this action
      if (processedActionsPaperless.has(actionKey)) {
        return;
      }
      
      // Mark this action as processed IMMEDIATELY to prevent race conditions
      processedActionsPaperless.add(actionKey);
      processedActionsTimestampsPaperless.set(actionKey, Date.now());
      
      // API expects: param = OrderRef (e.g., "1651")
      const payload = {
        InvoiceNum: null,
        OrderRef: screenDetail.param,  // param contains the OrderRef (e.g., "1651")
        User: user?.username || null,
        ForceNewLabel: false,
        StationID: userState.stationid,
        Courier: null,
        CustomsDocType: null,
        Staging: false,
        AdminMode: false,
      };
      
      console.log('🏷️ MISC.LABEL action detected - Auto-printing misc label with payload:', payload);
      getMiscLabelPrintRequest(payload);
    }
  }, [screenDetail, userState, user, getMiscLabelPrintRequest, isFocused]);

  // Auto-trigger print label when action completes (with safeguards against infinite loops)
  useEffect(() => {
    // Only process if screen is focused to prevent background processing
    if (!isFocused) return;
    
    if (screenDetail && screenDetail.action === 'COMPLETE' && screenDetail.page === 'DISPATCH') {
      // Create unique key for this action to prevent duplicate processing
      const actionKey = `${screenDetail.ref}-${screenDetail.param}-${screenDetail.barcode}`;
      
      // Cleanup old entries periodically
      cleanupProcessedActionsPaperless();
      
      // Skip if we've already processed this action (module-level check persists across remounts)
      if (processedActionsPaperless.has(actionKey)) {
        return;
      }
      
      // Mark this action as processed IMMEDIATELY to prevent race conditions
      // Using module-level Set that persists across component remounts
      processedActionsPaperless.add(actionKey);
      processedActionsTimestampsPaperless.set(actionKey, Date.now());
      
      // Automatically trigger print label
      if (screenDetail.ref && screenDetail.param && user && user.username && userState) {
        let invoiceNum = screenDetail.param;
        let orderRef = screenDetail.ref;
        
        // If param and ref are the same, try to extract from HTML
        if (invoiceNum === orderRef && screenDetail.extraInfo) {
          console.log('⚠️ param and ref are identical, attempting to extract from HTML...');
          
          const htmlPurOrder = extractPurchaseOrderFromHTML(screenDetail.extraInfo);
          const htmlOrderRef = extractOrderRefFromHTML(screenDetail.extraInfo);
          
          if (htmlPurOrder && htmlOrderRef && htmlPurOrder !== htmlOrderRef) {
            invoiceNum = htmlPurOrder;
            orderRef = htmlOrderRef;
            console.log('✅ Using values extracted from HTML:', { invoiceNum, orderRef });
          } else {
            console.warn('⚠️ Could not extract different values from HTML');
          }
        }
        
        // For paperless dispatch completion: ForceNewLabel=false, AdminMode=false
        const payload = {
          InvoiceNum: invoiceNum,
          OrderRef: orderRef,
          User: user.username,
          ForceNewLabel: false, // False for dispatch completion
          StationID: userState.stationid,
          Staging: false,
          AdminMode: false, // False for dispatch completion
        };
        
        console.log('🖨️ Paperless Dispatch completed - Auto-printing label with payload:', payload);
        
        // Use setTimeout to prevent immediate re-render issues
        setTimeout(() => {
          getEscalationPrintRequest(payload);
        }, 100);
      }
    }
  }, [screenDetail, user, userState, getEscalationPrintRequest, isFocused]);

  useEffect(() => {
    if (!isFocused) {return;}

    let isMounted = true;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;

    // Only call scanBarcode if currentUrl is valid and differs from the last history URL
    if (
      isMounted &&
      currentUrl.includes('/api/dispatch/CMD.PDISPATCH') &&
      currentUrl === lastUrlInHistory &&
      !screenDetail &&
      !globalLoading &&
      errorText === null
    ) {
      const lastPart = urlLastPart(lastUrlInHistory);

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

      scanBarcode(data);
    }
    return () => {
      isMounted = false; // Clean up flag on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onMessage = event => {
    const code = event.nativeEvent.data;

    const lastUrlInHistory =
      screenHistoryUrl.length > 0
        ? screenHistoryUrl[screenHistoryUrl.length - 1]
        : null;
    const lastPart = urlLastPart(lastUrlInHistory);

    // All messages (including LBL. print commands) go through scanBarcode
    // The API will return action: "MISC.LABEL" with param containing the OrderRef
    // The useEffect for MISC.LABEL action will then call the MiscLabel API
    const data = {
      userName: user.username,
      page: screenDetail?.page || 'PDISPATCH',
      barcode: code,
      currentPage: lastPart,
    };

    console.log('PaperlessDispatchScreen - Sending scan data to API:', data);
    scanBarcode(data);
  };

  const injectedJS = `
  // Function to add touchable opacity effect on all buttons
  (function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.transition = 'opacity 0.2s'; // Smooth transition
      button.addEventListener('touchstart', function() {
        this.style.opacity = '0.6'; // Decrease opacity on touch
      });
      button.addEventListener('touchend', function() {
        this.style.opacity = '1'; // Reset opacity when touch ends
      });
      button.addEventListener('touchcancel', function() {
        this.style.opacity = '1'; // Reset opacity if touch is canceled
      });
    });
  })();
`;

  return (
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
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{
            html: `
        <html>
          <head>
          <meta name="viewport" content="width=device-width, initial-scale=0.79, maximum-scale=0.79, user-scalable=no">
          <style>
           ${screenDetail && screenDetail.commonCss}
     
          </style>
           </head>
          <body>
          ${screenDetail ? screenDetail.extraInfo : ''}
         
          
              </body>
        </html>
      `,
          }}
          injectedJavaScript={injectedJS}
          onMessage={onMessage}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
});

PaperlessDispatchScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  scanBarcode: PropTypes.func.isRequired,
  getEscalationPrintRequest: PropTypes.func.isRequired,
  getMiscLabelPrintRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {
  scanBarcode: barCodeAction,
  getEscalationPrintRequest,
  getMiscLabelPrintRequest,
})(PaperlessDispatchScreen);
