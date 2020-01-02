import Taro, { useState, useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import carams from '../../asset/phone.png';
import { useDispatch, useSelector } from '@tarojs/redux';
import api from '../../apis';
import actions from '../../store/actions';
import './index.less';

const Detail = () => {

    const [data, setData] = useState([]);

    const router = useRouter();
    const { userinfo } = useSelector(data => data.user);
    const dispatch = useDispatch();

    const { text, name } = router.params;

    name && Taro.setNavigationBarTitle({ title: name + '识别' });

    function phone() {
        Taro.chooseImage({
            sourceType: ['album', 'camera'],
            count: 1,
            sizeType: ['compressed'],
            success(res) {
                Taro.showLoading({
                    title: '识别中...',
                    mask: true,
                });
                const path = res.tempFilePaths[0];
                transformBase64(path);
            }
        })
    }

    function transformBase64(res) {
        const FSM = Taro.getFileSystemManager();
        FSM.readFile({
            filePath: res,
            encoding: "base64",
            success: function (data) {
                api.post(
                    {
                        url: `https://aip.baidubce.com/rest/2.0/image-classify${text}?access_token=24.edad8f469e819436d3dad37098eb0baa.2592000.1580528232.282335-14954581`,
                        data: { image: data.data, baike_num: 1 }
                    }).then(res => {
                        let update_user = '';
                        let success = userinfo.success;
                        let fail = userinfo.fail;
                        if (res.data.result) {
                            switch (name) {
                                case '通用':
                                    setData(res.data.result.map(item => ({ name: item.keyword, score: item.score, baike_info: item.baike_info || {} })));
                                    break;
                                case '动物':
                                    setData(res.data.result);
                                    break;
                                case '植物':
                                    setData(res.data.result);
                                    break;
                                case 'logo':
                                    setData(res.data.result.map(item => ({ name: item.name, score: item.probability, baike_info: {} })));
                                    break;
                                case '果蔬':
                                    setData(res.data.result);
                                    break;
                                case '地标':
                                    setData(res.data.result.map(item => ({ name: item.landmark, score: 100 })));
                                    break;
                                case '菜品':
                                    setData(res.data.result.map(item => ({ name: item.name, score: item.probability, baike_info: item.baike_info || {} })));
                                    break;
                            }
                            update_user = `mutation {
                                    updateAI(id: "${userinfo.id}", data: { all: ${userinfo.all + 1}, success: ${userinfo.success + 1} }) {
                                        id,
                                        name,
                                        success
                                    }
                            }`;
                            success += 1;
                        } else {
                            update_user = `mutation {
                                    updateAI(id: "${userinfo.id}", data: { all: ${userinfo.all + 1}, fail: ${userinfo.fail + 1} }) {
                                    id,
                                    name,
                                    success
                                }
                            }`;
                            fail += 1;
                        }
                        api.graphql({ url: '', data: update_user });
                        dispatch(actions.setUserInfo({ ...userinfo, success, fail, all: userinfo.all + 1 }));

                        Taro.hideLoading();
                    })
            }
        });
    }

    return (
        <View className='detail'>
            <View onClick={phone} className="phone">
                <Image src={carams} className="carams" />
                <Text className="text">识别{name}</Text>
            </View>
            <View>
                {
                    data.length > 0 && data.map((item: { name: string, score: number }) => {
                        return (
                            <View key={item.name} className="data">
                                <Text className="name" >{item.name}</Text><Text className="score"> {(item.score * 100).toFixed(2)}% </Text>
                            </View>
                        )
                    })
                }
            </View>
        </View >
    )
}
export default Detail;

