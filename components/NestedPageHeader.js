import {Text, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const NestedPageHeader = ({pageName}) => {
  return (
    <LinearGradient
      colors={['#0175b2', '#4b3d91']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <Text style={styles.text}>{pageName}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 0,
    shadowColor: 'transparent',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: 'white',
  },
});

export default NestedPageHeader;
