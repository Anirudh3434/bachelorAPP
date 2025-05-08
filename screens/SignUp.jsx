import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import GoogleSignInButton from '../Components/buttons/googleButton';
import Colors from '../theme/Colors';
import service from '../Appwrite/config';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      auth().onAuthStateChanged(user => {
        if (user) {
          console.log('User is signed in', user);
          navigation.replace('Salary');
        }
      });
    };
    checkAuth();
  }, []);

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Info', 'Please fill out all fields');
      return;
    }

    try {
      const token = await getFCMToken();

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user_id = userCredential.user.uid;

      if (user_id) {
        const response = await service.createUser(name, email, user_id);
        if (response) {
          if (token) {
            const postToken = await service.PostFCMToken(user_id, token);
            if (postToken) {
              console.log('FCM Token saved successfully');
            }
          }
          navigation.replace('Salary');
        } else {
          Alert.alert('Sign Up Failed', 'Failed to create user in DB');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Let’s get you started!</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <GoogleSignInButton />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

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