import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getLocalCurrentScreen} from '../../actions/global';
import ScanScreenMainText from '../../components/ScanScreenMainText';
import NestedPageHeader from '../../components/NestedPageHeader';
import {StyleSheet, View} from 'react-native';
import {urlLastPart} from '../../utils/urlLastPart';

const CrossDockScreen = ({
  Global: {localCurrentPage, currentUrl},
  getLocalCurrentScreen,
}) => {
  useEffect(() => {
    const lastPart = urlLastPart(currentUrl);

    if (!localCurrentPage && lastPart === 'cross_dock') {
      getLocalCurrentScreen('XDOCK');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NestedPageHeader pageName="Cross Dock" />
      </View>

      <ScanScreenMainText screenText="Scan a parcel" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
});

CrossDockScreen.propTypes = {
  Global: PropTypes.object.isRequired,
  getLocalCurrentScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Global: state.Global,
});

export default connect(mapStateToProps, {getLocalCurrentScreen})(
  CrossDockScreen,
);
