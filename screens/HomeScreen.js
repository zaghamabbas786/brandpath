import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logoutRequest} from '../actions/auth';
import {getScreenRequest} from '../actions/global';
import ButtonWithIcon from '../components/ButtonWithIcon';
import {chunkArray} from '../utils/chunkArray';

const HomeScreen = ({
  Auth: {user, homeScreen},
  navigation,
  logout,
  getScreen,
}) => {
  const handleNavigate = ({screen, action}) => {
    const trimmedUrl = action.url.trim();
    getScreen(trimmedUrl);
    navigation.navigate(screen);
  };
  const handleVersionNavigate = () => {
    navigation.navigate('VersioningScreen');
  };

  // Chunk buttons into rows of two
  const buttonRows = homeScreen ? chunkArray(homeScreen, 2) : [];
  return (
    <View style={styles.container}>
      {/* Scrollable Button Rows */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, buttonIndex) => (
              <ButtonWithIcon
                key={buttonIndex}
                title={button.name}
                iconName={button.iconName}
                color={button.style.backgroundColor}
                onPress={() =>
                  handleNavigate({
                    screen: button.navigation,
                    action: button.action,
                  })
                }
                vertical={true}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Fixed Version Button */}
      <TouchableOpacity onPress={handleVersionNavigate}>
        <LinearGradient
          colors={['#0175b2', '#4b3d91']}
          style={styles.buttonGradient}>
          <View style={styles.buttonContent}>
            <FontAwesome
              name="info-circle" // Icon for Version button
              size={20}
              color="#fff"
              style={styles.icon}
              solid={false}
            />
            <Text style={[styles.buttonText, {paddingHorizontal: 0}]}>
              Version
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      {/* Fixed Logout Button */}
      <TouchableOpacity
        onPress={() => logout(user.username)}
        style={{marginVertical: 15}}>
        <LinearGradient
          colors={['#0175b2', '#4b3d91']}
          style={styles.buttonGradient}>
          <View style={styles.buttonContent}>
            <FontAwesome
              name="sign-out-alt" // Use FontAwesome 5 outline icon name
              size={20}
              color="#fff"
              style={styles.icon}
              solid={false} // Use outline (light) style
            />
            <Text style={[styles.buttonText, {paddingHorizontal: 0}]}>
              Logout
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Ensure the ScrollView grows to fit its content
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the buttons
    alignItems: 'center',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'UbuntuMedium',
    color: '#fff',
    paddingHorizontal: 12, // Add horizontal padding for the text
    textAlign: 'center', // Ensure text is centered even when it wraps
  },
});

HomeScreen.propTypes = {
  Auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  getScreen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  logout: logoutRequest,
  getScreen: getScreenRequest,
})(HomeScreen);
