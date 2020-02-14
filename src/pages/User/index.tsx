import Taro, { useEffect } from '@tarojs/taro';
import { View, Text, Image, Button, OpenData } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import person from '../../asset/person.png';
import actions from '../../store/actions';
import api from '../../apis';
import './index.less';

const type = { '识别数': 'all', '成功数': 'success', '失败数': 'fail' };

const User = () => {

    const { userinfo } = useSelector(data => data.user);
    const dispatch = useDispatch();

    function addData(name, pic) {
        const get_user = `query{
            allAIS(where: { name: "${name}" }) {
                id,
                name,
                success,
                all,
                fail
              }
          }`;
        api.graphql({ url: '', data: get_user }).then(res => {
            const { allAIS } = res.data.data;

            if (allAIS.length === 0) {
                const add_user = `mutation {
                    createAI(data: { name: "${name}", success: 0, fail: 0, all: 0 }) {
                      id
                    }
                  }`;

                api.graphql({ url: '', data: add_user });
                dispatch(actions.setUserInfo({ ...userinfo, status: 2, name, picture: pic }));
            } else {
                const thisData = allAIS[0];
                dispatch(actions.setUserInfo({ ...userinfo, success: thisData.success, fail: thisData.fail, all: thisData.all, name, picture: pic, status: 2 }));
            }
        });
    }

    function bindGetUserInfo(e) {
        if (e.detail.userInfo) {
            const { nickName, avatarUrl } = e.detail.userInfo;
            addData(nickName, avatarUrl);
            // dispatch(actions.setUserInfo({ ...userinfo, status: 2, name: nickName, picture: avatarUrl }));
        }
    }

    Taro.setNavigationBarTitle({ title: 'AI小助手' });

    return (
        <View className='user'>
            {
                userinfo.status !== 2 ? <View className="header">
                    <Image src={person} className="img" />
                    <Button className="login" open-type='getUserInfo' onGetUserInfo={bindGetUserInfo}>登录</Button>
                </View> : <View className="header">
                        <Image src={userinfo.picture} className="img" />
                        <Text className="login" >{userinfo.name}</Text>
                    </View>
            }
            <View className="circle">
                <View className="one" />
                <View className="one" />
                <View className="one" />
            </View>
            <View className="numShow">
                {
                    Object.keys(type).map(item => {
                        return <View className="result" key={item}>
                            <Text className="text">{item}</Text>
                            <Text className="num">{userinfo[type[item]]}</Text>
                        </View>
                    })
                }
            </View>
        </View >
    )
}

export default User;

