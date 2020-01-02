import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import img1 from '../../asset/welcome.png';
import img2 from '../../asset/welcomeUser.png';
import './index.less';

const Welcome = () => {

  function welcome() {
    Taro.switchTab({
      url: '../Home/index'
    });
  }

  return (
    <View className='welcome'>
      <Image src={img1} className="img1" />
      <Image src={img2} className="img2" />
      <View className="canPhone" onClick={welcome}>
        <Text>点击进入</Text>
      </View>
    </View >
  )
}

export default Welcome;

