import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    // Integrate your Google auth logic here
    console.log("Google Sign-In pressed");
  };

  return (
    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
      <Image
        source={require('../../assets/images/google.png')}
        style={styles.googleLogo}
      />
      <Text style={styles.googleText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderColor: '#18695A',
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: 20,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#18695A',
    fontWeight: '600',
  },
});