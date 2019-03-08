import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  Navigator,
  AlertIOS,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markWrap: {
    flex: 1,
    paddingVertical: 30,
  },
  background: {
    width,
    height,
    backgroundColor: 'rgba(40, 80, 200, 0.5)'
  },
  wrapper: {
    paddingVertical: 30,
  },
  inputWrap: {
    flexDirection: 'row',
    marginVertical: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#FFF',
  },
  button: {
    backgroundColor: 'rgba(40, 80, 200, 0.8)',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 10
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default class login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
    };
  }

  goProfile(nickname) {
    if (nickname === '') {
      AlertIOS.alert(
        'Empty nickname',
        'Nickname field is required',
      );
    } else {
      this.props.navigator.push({ ident: 'Profile', nickname });
    }
  }

  render() {
    return (
      <View style={[styles.container, styles.background]}>
        <View style={styles.background}>
          <View style={styles.markWrap} />
          <View style={styles.wrapper}>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Nickname"
                placeholderTextColor="#FFF"
                style={styles.input}
                onChangeText={text => this.setState({ nickname: text })}
                value={this.state.nickname}
              />
            </View>

            <TouchableOpacity activeOpacity={0.5} onPress={() => this.goProfile(this.state.nickname)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}
