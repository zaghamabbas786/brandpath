import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import {versionData} from '../constants';
import NestedPageHeader from '../components/NestedPageHeader';

const VersionSection = ({title, details, releaseDate}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.versionContainer}>
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        style={[styles.header, !collapsed && styles.headerExpanded]}>
        <Text style={styles.headerText}>{title}</Text>
        <View style={styles.rightContainer}>
          <View style={styles.dateContainer}>
            <FontAwesome
              name="calendar"
              size={14}
              color="#1cae97"
              style={styles.dateIcon}
            />
            <Text style={styles.releaseDate}>{releaseDate}</Text>
          </View>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#0175b2', '#4b3d91']}
              style={styles.gradientCircle}>
              <FontAwesome
                name={collapsed ? 'chevron-left' : 'chevron-down'}
                size={16}
                color="#fff"
              />
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View style={styles.content}>
          {details.map((item, index) => (
            <View key={index} style={styles.contentItem}>
              <FontAwesome
                name="check"
                size={14}
                color="#1cae97"
                style={styles.bulletIcon}
              />
              <Text style={styles.contentText}>{item}</Text>
            </View>
          ))}
        </View>
      </Collapsible>
    </View>
  );
};

const VersionScreen = () => {
  return (
    <View style={styles.container}>
      <NestedPageHeader pageName="Version" />
      <ScrollView keyboardShouldPersistTaps="handled">
        {versionData.map((version, index) => (
          <VersionSection
            key={index}
            title={version.title}
            details={version.details}
            releaseDate={version.releaseDate}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  releaseDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#767b7f',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateIcon: {
    marginRight: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#494192',
    borderRadius: 25,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  headerExpanded: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#383838',
  },
  versionContainer: {
    marginTop: 15,
  },
  content: {
    paddingBottom: 15,
    paddingTop: 4,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#494192',
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletIcon: {
    marginRight: 5,
  },
  contentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#767b7f',
    maxWidth: '95%',
  },
  iconContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VersionScreen;
