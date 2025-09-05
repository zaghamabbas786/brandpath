import React from 'react';
import {View, StyleSheet} from 'react-native';
import NestedPageHeader from '../../components/NestedPageHeader';
import ReusableScreen from '../../components/ReusableScreen';

const ReturnsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <NestedPageHeader pageName="Returns" />
      <ReusableScreen navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReturnsScreen;
