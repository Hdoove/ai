import Taro, { useEffect } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';
import ai from '../../asset/ai.png';
import actions from '../../store/actions';
import api from '../../apis';
import tongyong from '../../asset/tongyong.png';
import dongwu from '../../asset/dongwu.png';
import zhiwu from '../../asset/zhiwu.png';
import logo from '../../asset/logo.png';
import guoshu from '../../asset/guoshu.png';
import dibiao from '../../asset/dibiao.png';
import caipin from '../../asset/caipin.png';
import './index.less';

const classify = {
  '通用': {
    url: '/v2/advanced_general',
    png: tongyong
  },
  '动物': { url: '/v1/animal', png: dongwu },
  '植物': { url: '/v1/plant', png: zhiwu },
  'logo': { url: '/v2/logo', png: logo },
  '果蔬': { url: '/v1/classify/ingredient', png: guoshu },
  '地标': { url: '/v1/landmark', png: dibiao },
  '菜品': { url: '/v2/dish', png: caipin },
}

const Index = () => {

  const { userinfo } = useSelector(data => data.user);
  const dispatch = useDispatch();

  Taro.setNavigationBarTitle({ title: 'AI小助手' });

  useEffect(() => {
    Taro.showLoading({
      title: '数据加载中',
      mask: true
    });
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === true) {
          Taro.getUserInfo({
            success: res => {
              dispatch(actions.setUserInfo({ ...userinfo, status: 2, name: res.userInfo.nickName, picture: res.userInfo.avatarUrl }));
              const get_user = `query{
                allAIS(where: { name: "${res.userInfo.nickName}" }) {
                    id,
                    name,
                    success,
                    all,
                    fail
                  }
              }`;
              Taro.hideLoading();
              api.graphql({ url: '', data: get_user }).then(data => {
                const { allAIS } = data.data.data;
                if (allAIS.length === 0) {
                  const add_user = `mutation {
                        createAI(data: { name: "${name}", success: 0, fail: 0, all: 0 }) {
                          id
                        }
                      }`;

                  api.graphql({ url: '', data: add_user });
                } else {
                  const thisData = allAIS[0];
                  dispatch(actions.setUserInfo({ ...userinfo, status: 2, name: res.userInfo.nickName, picture: res.userInfo.avatarUrl id: thisData.id, success: thisData.success, fail: thisData.fail, all: thisData.all }));
                }
              });
            }
          });
        } else {
          Taro.hideLoading();
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
          return <Image src={classify[item].png} key={item} onClick={() => handleGoto(classify[item].url, item)} className="classify" />
        })
      }
    </View >
  )
}

export default Index;

