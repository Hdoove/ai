import Taro, { useState, useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import carams from '../../asset/phone.png';
import api from '../../apis';
import './index.less';

const Detail = () => {

    const [data, setData] = useState([]);

    const router = useRouter();

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
                        if (res.data.result) {
                            switch (name) {
                                case '通用':
                                    console.log(1);
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
                        }
                        const add_user = `mutation {
                            createAI(data: { name: "Mike", success: 0, fail: 0, all: 0 }) {
                              id
                            }
                          }`;

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

