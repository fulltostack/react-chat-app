import React, { Component } from "react";
import { AppRegistry, View, Navigator, Dimensions } from "react-native";

import Chat from "./components/chat";
import Profile from "./components/profile";
import Login from "./components/login";

const { width, height } = Dimensions.get("window");

export default class chatApp extends Component {
  rederScene(route, navigator) {
    var globalProps = { navigator };

    switch (route.ident) {
      case "Login":
        return <Login {...globalProps} />;
      case "Profile":
        return <Profile {...globalProps} nickname={route.nickname} />;
      case "Chat":
        return (
          <Chat
            {...globalProps}
            chatId={route.chatId}
            receiver={route.receiver}
            emitter={route.emitter}
            socket={route.socket}
            isOnline={route.isOnline}
          />
        );
    }
  }

  configureScene(route, routeStack) {
    switch (route.ident) {
      case "Profile":
        return Navigator.SceneConfigs.PushFromRight;
      case "Chat":
        return Navigator.SceneConfigs.PushFromRight;
      default:
        return Navigator.SceneConfigs.FloatFromRight;
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ ident: "Login" }}
        renderScene={this.rederScene}
        configureScene={this.configureScene}
      />
    );
  }
}

AppRegistry.registerComponent("chatApp", () => chatApp);
