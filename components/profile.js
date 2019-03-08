import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Navigator,
  AlertIOS,
  Dimensions,
  Image
} from "react-native";

import SocketIOClient from "socket.io-client";
import { HOST_IP } from '../config'

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  item: {
    padding: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#819FF7"
  },
  profileBar: {
    height: 150,
    width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(50,200,50, .5)"
  },
  nickname: {
    color: "#FFF",
    padding: 5,
    fontSize: 25
  },
  button: {
    padding: 5
  }
});

export default class profile extends Component {
  constructor(props) {
    super(props);
    // use your own local ip
    this.socket = SocketIOClient(`http://${HOST_IP}:8080`);
    this.state = {
      users: [{ id: 1, nickname: "Loading..." }]
    };

    this.socket.on("users", users => {
      this.setState({ users });
    });
  }

  componentDidMount() {
    this.socket.emit("join", this.props.nickname);
  }

  goChat(user, emitter, socket) {
    this.props.navigator.push({
      ident: "Chat",
      receiver: user.nickname,
      emitter,
      socket,
      chatId: user.id,
      isOnline: user.online
    });
  }

  renderUsers(data, emitter, socket) {
    const goChat = this.goChat.bind(this);
    return data.map((data, index) => {
      if (data.nickname == emitter) {
        return false;
      }
      return (
        <View key={index} style={styles.item}>
          <TouchableHighlight
            activeOpacity={0}
            underlayColor="#FFFFFF"
            style={styles.button}
            onPress={() => goChat(data, emitter, socket)}
          >
            <Text style={styles.itemText}>{data.nickname}</Text>
          </TouchableHighlight>
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <View style={styles.profileBar}>
          <Text style={styles.nickname}>{this.props.nickname}</Text>
        </View>
        {this.renderUsers(this.state.users, this.props.nickname, this.socket)}
      </View>
    );
  }
}
