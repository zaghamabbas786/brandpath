import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../context/auth/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {toTitleCase} from '../utils/toTitleCase';

const UserInfoContainer = ({Auth: {user}}) => {
  // const {user} = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Function to get the current time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hourIn12 = hours % 12 || 12; // Convert to 12-hour format
      const formattedTime = `${hourIn12}:${minutes} ${ampm}`;
      setCurrentTime(formattedTime);
    };

    // Set initial time
    updateTime();

    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.itemContainer, {alignItems: 'flex-start'}]}>
          <View style={styles.labelContainer}>
            <Icon name="person" size={20} color="#1cae97" style={styles.icon} />
            <Text style={[styles.label]}>
              Hello,{' '}
              <Text style={styles.boldText}>
                {' '}
                {user?.username ? toTitleCase(user.username) : 'Loading...'}
              </Text>
            </Text>
          </View>
        </View>

        <View style={[styles.itemContainer, {alignItems: 'flex-end'}]}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#1cae97"
              style={styles.icon}
            />
            <Text style={[styles.value]}>Time: {currentTime}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemContainer: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#383838',
  },
  boldText: {
    fontFamily: 'Poppins-ExtraBold',
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#767b7f',
    flexShrink: 1,
  },
});

UserInfoContainer.propTypes = {
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(UserInfoContainer);
