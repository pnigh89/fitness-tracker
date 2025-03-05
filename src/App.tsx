import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import WorkoutsScreen from './screens/WorkoutsScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/workouts" element={<WorkoutsScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/active-workout" element={<ActiveWorkoutScreen />} />
      </Routes>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    height: '100%',
  },
});
