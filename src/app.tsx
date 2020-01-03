import Taro, { Component } from '@tarojs/taro';
import Index from './pages/Home/index';
import { Provider } from '@tarojs/redux';
import configStore from './store';
import '../node_modules/taro-ui/dist/style/components/float-layout.scss';
import './app.less';

const store = configStore();

class App extends Component {

  config: Taro.Config = {
    pages: [
      'pages/Welcome/index',
      'pages/Home/index',
      'pages/User/index',
      'pages/Detail/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'AI小助手',
      navigationBarTextStyle: 'black',
      onReachBottomDistance: 50
    },
    tabBar: {
      borderStyle: "white",
      selectedColor: "#000",
      backgroundColor: "#fff",
      color: "#bfbfbf",
      list: [
        {
          pagePath: "pages/Home/index",
          text: "首页",
          selectedIconPath: "./asset/homeSelect.png",
          iconPath: "./asset/home.png"

        },
        {
          pagePath: "pages/User/index",
          text: "我的",
          selectedIconPath: "./asset/mySelect.png",
          iconPath: "./asset/my.png"

        }
      ]
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
