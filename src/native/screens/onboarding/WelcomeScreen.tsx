import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ArrowRight } from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Privacy' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/app-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Title */}
        <Text style={styles.title}>Joint Replacement Scanner</Text>

        {/* App Description */}
        <Text style={styles.description}>
          A simple way to scan QR codes containing joint replacement information and store it securely in your Apple Health repository.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, styles.blueIcon]}>
              <Image
                source={require('../../assets/scan-icon.png')}
                style={styles.featureIconImage}
              />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Scan QR Codes</Text>
              <Text style={styles.featureDescription}>
                Quickly scan joint replacement QR codes with your camera
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, styles.greenIcon]}>
              <Image
                source={require('../../assets/health-icon.png')}
                style={styles.featureIconImage}
              />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Health Integration</Text>
              <Text style={styles.featureDescription}>
                Store your joint replacement data securely in Apple Health
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, styles.purpleIcon]}>
              <Image
                source={require('../../assets/privacy-icon.png')}
                style={styles.featureIconImage}
              />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Privacy First</Text>
              <Text style={styles.featureDescription}>
                Your data stays on your device and is never shared without permission
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
          <ArrowRight name="arrow-right" size={20} color="#ffffff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    alignSelf: 'center',
    backgroundColor: '#ebf8ff',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#718096',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: '