import Taro, { useEffect } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';
import ai from '../../asset/ai.png';
import actions from '../../store/actions';
import './index.less';

const classify = {
  '通用': '/v2/advanced_general',
  '动物': '/v1/animal',
  '植物': '/v1/plant',
  'logo': '/v2/logo',
  '果蔬': '/ingredient',
  '地标': '/v1/landmark',
  '菜品': '/v2/dish',
}

const Index = () => {

  const { userinfo } = useSelector(data => data.user);
  const dispatch = useDispatch();

  Taro.setNavigationBarTitle({ title: 'AI识万物' });

  useEffect(() => {
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === true) {
          Taro.getUserInfo({
            success: res => {
              dispatch(actions.setUserInfo({ ...userinfo, status: 2, name: res.userInfo.nickName, picture: res.userInfo.avatarUrl }));
            }
          });
        }
      }
    });
  }, []);

  function handleGoto(text: string, name: string) {
    if (userinfo.status !== 2) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
      setTimeout(() => {
        Taro.switchTab({
          url: '../User/index'
        });
      }, 1000);

    } else {
      Taro.navigateTo({
        url: `../Detail/index?text=${text}&name=${name}`
      });
    }
  }

  return (
    <View className='index'>
      <Image src={ai} className="ai" />
      {
        Object.keys(classify).map(item => {
          return <View className="classify" key={item} onClick={() => handleGoto(classify[item], item)}>
            {item}
          </View>
        })
      }
    </View >
  )
}

export default Index;

