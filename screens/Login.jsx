import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import GoogleSignInButton from '../Components/buttons/googleButton';
import Colors from '../theme/Colors';
import { useNavigation } from '@react-navigation/native';
import { useAuthUser } from '../hooks/useAuthUser';
import service from '../Appwrite/config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcm_token, setFcmToken] = useState('');

 

  const userId = useAuthUser();

  if (userId) {
    navigation.replace('Home');
  }


  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log(token)
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('Logged in with:', user.email);

      const token = await getFCMToken();

      if (user) {
        const getFCMToken = await service.GetFCMToken(user.uid);
        if (getFCMToken) {
          console.log('FCM Token:', token);
          console.log('User ID:', user.uid);
          const postToken = await service.UpdateFCMToken( user.uid, token, getFCMToken.documents[0].$id);
          console.log( 'Post Token:', postToken)
          if (postToken) {
            console.log('FCM Token updated successfully');
            navigation.replace('Home');
          } else {
            console.log('Failed to update FCM token');
          }
        } else {
          console.log('Failed to get FCM token');
        }
      }

      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <GoogleSignInButton />

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.accent,
    marginBottom: 24,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.accent,
    fontWeight: '500',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.accent,
  },
  link: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});