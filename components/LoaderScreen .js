import {View, Text, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const LoaderScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner visible={true} />
      <Image
        source={require('../assets/images/screen.jpg')}
        style={{flex: 1, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default LoaderScreen;
