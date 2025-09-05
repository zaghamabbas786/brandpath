import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const ScanScreenMainText = ({screenText, subText}) => {
  return (
    <View style={styles.centeredContent}>
      <Text style={styles.centerText}>{screenText}</Text>
      {subText ? <Text style={styles.subText}>{subText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#ef1a1a',
    textAlign: 'center',
  },
  subText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default ScanScreenMainText;
