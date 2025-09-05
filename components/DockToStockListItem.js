// DockToStockListItem.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {formatDate} from '../utils/formatDate ';

const DockToStockListItem = ({item, onClick}) => (
  <TouchableOpacity onPress={onClick} style={styles.inputContainer}>
    <View style={styles.list}>
      <LinearGradient
        colors={['#0276b3', '#494192']}
        style={styles.gradientLine}
      />

      <View style={styles.newTextSection}>
        <View style={styles.textContainer}>
          <Text style={[styles.textBold, styles.leftText, {color: '#2a8a57'}]}>
            {item.poNum}
          </Text>
          <Text
            style={[
              styles.textBold,
              styles.rightText,
              {color: '#4c85c2', fontSize: 10},
            ]}>
            {item.supplierPONum}
          </Text>
        </View>

        <View style={[styles.textContainer, {paddingTop: 5}]}>
          <Text style={[styles.text, styles.leftText]}>
            {item.supplier}; Line(s): {item.lines}, ({item.qty_remaining} /{' '}
            {item.total_qty})
          </Text>
          <Text style={[styles.date, styles.rightText]}>
            {formatDate(item.poDate)}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

DockToStockListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  list: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    // paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 0,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  gradientLine: {
    position: 'absolute',
    width: 8,

    height: '100%',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  newTextSection: {
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 15,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#767b7f',
  },
  textBold: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#767b7f',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#767b7f',
  },
  leftText: {
    flex: 1,
  },
  rightText: {
    textAlign: 'right',
  },
});

export default DockToStockListItem;
