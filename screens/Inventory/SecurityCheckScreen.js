import React from 'react';
import ScanScreenMainText from '../../components/ScanScreenMainText';
import NestedPageHeader from '../../components/NestedPageHeader';
import {StyleSheet, View} from 'react-native';
const SecurityCheckScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NestedPageHeader pageName="Security Check" />
      </View>

      <ScanScreenMainText
        screenText="Attention!"
        subText="Scan or enter a tracking code"
      />
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

export default SecurityCheckScreen;
