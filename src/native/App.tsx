import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Home,
  Clock,
  Settings as SettingsIcon,
} from "react-native-vector-icons/Feather";

// Screens
import QRScanner from "./components/QRScanner";
import ScanHistory from "./components/ScanHistory";
import Settings from "./components/Settings";

// Onboarding Screens
import WelcomeScreen from "./screens/onboarding/WelcomeScreen";
import PrivacyInformation from "./screens/onboarding/PrivacyInformation";
import HealthKitPermissions from "./screens/onboarding/HealthKitPermissions";
import LimitedFunctionalityNotice from "./screens/onboarding/LimitedFunctionalityNotice";

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Scanner") {
            return <Home name="home" size={size} color={color} />;
          } else if (route.name === "History") {
            return <Clock name="clock" size={size} color={color} />;
          } else if (route.name === "Settings") {
            return <SettingsIcon name="settings" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#3182ce",
        tabBarInactiveTintColor: "#718096",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Scanner" component={QRScanner} />
      <Tab.Screen name="History" component={ScanHistory} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

// Onboarding navigator
const OnboardingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Privacy" component={PrivacyInformation} />
      <Stack.Screen name="HealthKit" component={HealthKitPermissions} />
      <Stack.Screen name="Limited" component={LimitedFunctionalityNotice} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // First time launching the app
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        // If there's an error reading from storage, default to showing the main app
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Show loading state while checking if it's first launch
  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch ? (
            <Stack.Screen name="Onboarding" component={OnboardingStack} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
