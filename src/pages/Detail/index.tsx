import Taro, { useState, useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import carams from '../../asset/phone.png';
import xiangji from '../../asset/xiangji.png';
import { useDispatch, useSelector } from '@tarojs/redux';
import api from '../../apis';
import actions from '../../store/actions';
import { AtFloatLayout } from "taro-ui"
import './index.less';

const Detail = () => {

    const [data, setData] = useState([]);
    const [path, setPath] = useState<string>('');
    const [chooseItem, setChooseItem] = useState<{ name: string, baike_info: { description: string } }>({ name: '', baike_info: { description: '' } });
    const [isOpen, setIsOpen] = useState<boolean>(false);

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

    function transformBase64(path) {
        const FSM = Taro.getFileSystemManager();
        FSM.readFile({
            filePath: path,
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
                        setPath(path);
                    })
            }
        });
    }

    function handleShowMore(item) {
        setChooseItem(item);
        setIsOpen(true);
    }

    return (
        <View className='detail'>
            <AtFloatLayout isOpened={isOpen} title={chooseItem.name} scrollY={true} onClose={() => setIsOpen(false)}>
                <View style={{ width: '100%', textAlign: 'center', padding: '1vh 0' }}>百度百科</View>
                {chooseItem.baike_info.description}
            </AtFloatLayout>
            {
                data.length > 0 ? <View>
                    <View>
                        <Image src={path} style={{ display: 'block', margin: '5vh auto 0' }} />
                        {
                            data.length > 0 && data.map((item: { name: string, score: number, baike_info: any }) => {
                                const score = (item.score * 100).toFixed(2);
                                return (

                                    <View key={item.name} className="data">
                                        <Text className="name" >{item.name}</Text>
                                        <Text className="score"> {score}% </Text>
                                        <View className="process">
                                            <View className="processBody" style={{ width: score + '%' }} />
                                        </View>
                                        <Text onClick={() => handleShowMore(item)} className="more" style={{ display: item.baike_info && item.baike_info.description ? '' : 'none' }}>详情</Text>
                                    </View>
                                )
                            })
                        }
                        <View style={{ height: '15vh' }} ></View>
                    </View>
                    <View className="footer">
                        <View onClick={phone} className="phone">
                            <Image src={carams} className="carams" />
                            <Text className="text">识别{name}</Text>
                        </View>
                    </View>
                </View> : <View className="canPhone" onClick={phone}>
                        <Image src={xiangji} className="carams" />
                    </View>
            }
        </View >
    )
}
export default Detail;

