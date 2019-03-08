import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  Dimensions,
  AlertIOS
} from "react-native";

import SocketIOClient from "socket.io-client";
import TopBar from "./topBar";
import { GiftedChat } from "react-native-gifted-chat";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  chatWrap: {
    width,
    height
  },
  onlineIndicator: {
    fontSize: 20,
    color: "green"
  },
  subtitleWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
});

export default class chat extends Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.state = {
      isTyping: false,
      isOnline: props.isOnline,
      chat: [
        {
          emitter: this.props.emitter,
          receiver: this.props.receiver,
          message: "Hola",
          date: new Date(Date.UTC(2016, 7, 30, 17, 20, 0))
        }
      ],
      message: "",
      messages: []
    };

    this.onSend = this.onSend.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getSubtitleComponent = this.getSubtitleComponent.bind(this);

    this.socket.on("receiver", message => {
      const data = [
        {
          text: message.message[0].text,
          user: { _id: 2 },
          createdAt: message.message[0].createdAt,
          _id: message.message[0]._id
        }
      ];

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, data)
      }));
    });

    this.socket.on("typing", () => {
      this.setState({ isTyping: true });
    });

    this.socket.on("stop-typing", () => {
      this.setState({ isTyping: false });
    });

    this.socket.on("user-offline", users => {
      users.forEach(({ id }) => {
        if (id === props.chatId) {
          this.setState({ isOnline: false });
        }
      });
      // this.setState({ isTyping: false })
    });
  }

  handleInputChange(messageText) {
    const metaInfo = {
      emitter: this.props.emitter,
      receiver: this.props.receiver,
      chatId: this.props.chatId
    };

    if (messageText && messageText.trim()) {
      if (!this.isTyping) {
        this.socket.emit("typing", metaInfo);
        this.isTyping = true;
      }
    } else {
      if (this.isTyping) {
        this.socket.emit("stop-typing", metaInfo);
        this.isTyping = false;
      }
    }
  }

  getSubtitleText(isOnline, isTyping) {
    if (isTyping) {
      return "typing...";
    } else if (isOnline) {
      return "online";
    }
  }

  getSubtitleComponent() {
    const { isTyping } = this.state;
    const isOnline = this.state.isOnline;

    if (!isOnline) {
      return <View />;
    }

    return (
      <View style={styles.subtitleWrapper}>
        {!isTyping && <Text style={styles.onlineIndicator}>{" • "}</Text>}
        <Text>{this.getSubtitleText(isOnline, isTyping)}</Text>
      </View>
    );
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    const objMessage = {
      emitter: this.props.emitter,
      receiver: this.props.receiver,
      message: messages,
      chatId: this.props.chatId
    };

    this.socket.emit("stop-typing", objMessage);
    this.socket.emit("send", objMessage);
  }

  goBack() {
    const metaInfo = {
      emitter: this.props.emitter,
      receiver: this.props.receiver,
      chatId: this.props.chatId
    };

    this.socket.emit("stop-typing", metaInfo);
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.chatWrap}>
        <TopBar
          navigator={this.props.navigator}
          title={this.props.receiver}
          renderSubtitleComponent={this.getSubtitleComponent}
          onGoBack={this.goBack}
        />
        <GiftedChat
          style={{ borderWidth: 1 }}
          messages={this.state.messages}
          onSend={this.onSend}
          onInputTextChanged={this.handleInputChange}
          user={{
            _id: 1
          }}
        />
      </View>
    );
  }
}
