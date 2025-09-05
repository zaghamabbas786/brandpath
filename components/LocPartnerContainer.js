import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LocationModal from './LocationModal ';
import PartnerModal from './PartnerModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setDispEnvAction} from '../actions/global';

const LocPartnerContainer = ({
  Auth: {user},
  Global: {userState, locationList, partnerList},
  setDispEnv,
}) => {
  const [location, setLocation] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isPartnerModalVisible, setPartnerModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location && userState && locationList?.length > 0) {
      // Find the location object based on the stationid
      const selectedLocation = locationList.find(
        loc => loc.stationID === userState.stationid,
      );
      if (selectedLocation) {
        setLocation(prevLocation => prevLocation || selectedLocation);
      }
    }
    if (!partner && userState && partnerList?.length > 0) {
      // Find the partner object based on the partnerKey
      const selectedPartner = partnerList.find(
        prtner => prtner.partnerKey === userState.partnerkey,
      );

      if (selectedPartner) {
        setPartner(prevPartner => prevPartner || selectedPartner);
      }
    }
  }, [userState, locationList, partnerList, location, partner]);

  const updateEnvAndFetchState = async (newStationID, newPartnerKey) => {
    const data = {
      userName: user.username,
      stationID: newStationID,
      partnerKey: newPartnerKey,
    };
    setDispEnv(data);
  };

  const handleLocationSelect = selectedLocation => {
    setLocationModalVisible(false);
    updateEnvAndFetchState(
      selectedLocation.stationID,
      partner?.partnerKey ?? null,
    );
  };

  const handlePartnerSelect = selectedPartner => {
    setPartnerModalVisible(false);
    updateEnvAndFetchState(
      location?.stationID ?? null,
      selectedPartner.partnerKey,
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.itemContainer, {alignItems: 'flex-start'}]}>
          <View style={styles.labelContainer}>
            <Icon
              name="map-marker"
              size={20}
              color="#1cae97"
              style={styles.icon}
            />
            <Text style={[styles.label]}>Location</Text>
          </View>
          <TouchableOpacity
            disabled={loading}
            onPress={() => setLocationModalVisible(true)}>
            <Text style={[styles.value, {marginLeft: 16}]}>
              {loading
                ? 'Loading....'
                : userState && userState.stationid
                ? location?.locationName || 'Not Set'
                : 'Not Set'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.itemContainer, {alignItems: 'flex-end'}]}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="office-building-outline"
              size={20}
              color="#1cae97"
              style={styles.icon}
            />
            <Text style={[styles.label]}>Partner</Text>
          </View>
          <TouchableOpacity
            disabled={loading}
            onPress={() => setPartnerModalVisible(true)}>
            <Text style={[styles.value]}>
              {loading
                ? 'Loading....'
                : userState && userState.partnerkey
                ? partner?.name || 'Not Set'
                : 'Not Set'}
            </Text>
          </TouchableOpacity>
        </View>

        <LocationModal
          visible={isLocationModalVisible}
          onClose={() => setLocationModalVisible(false)}
          locations={locationList || []}
          onSelectLocation={handleLocationSelect}
        />
        <PartnerModal
          visible={isPartnerModalVisible}
          onClose={() => setPartnerModalVisible(false)}
          partners={partnerList || []}
          onSelectPartner={handlePartnerSelect}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 0,
    shadowColor: 'transparent',
    flexDirection: 'row',
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
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#767b7f',
    flexShrink: 1,
  },
});

LocPartnerContainer.propTypes = {
  Auth: PropTypes.object.isRequired,
  Global: PropTypes.object.isRequired,
  setDispEnv: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
  Global: state.Global,
});

export default connect(mapStateToProps, {setDispEnv: setDispEnvAction})(
  LocPartnerContainer,
);
