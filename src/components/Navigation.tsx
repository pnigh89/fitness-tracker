import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';

// Icon components using unicode symbols with enhanced styling
const HomeIcon = ({ active }: { active: boolean }) => (
  <Text style={[styles.icon, active && styles.activeIcon]}>⌂</Text>
);

const WorkoutsIcon = ({ active }: { active: boolean }) => (
  <Text style={[styles.icon, active && styles.activeIcon]}>◎</Text>
);

const ProgressIcon = ({ active }: { active: boolean }) => (
  <Text style={[styles.icon, active && styles.activeIcon]}>📈</Text>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <Text style={[styles.icon, active && styles.activeIcon]}>👤</Text>
);

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <View style={styles.navigation}>
      <TouchableOpacity
        style={[styles.navItem, isActive('/') && styles.activeNavItem]}
        onPress={() => navigate('/')}
      >
        <HomeIcon active={isActive('/')} />
        <Text style={[styles.navText, isActive('/') && styles.activeNavText]}>Home</Text>
        {isActive('/') && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/workouts') && styles.activeNavItem]}
        onPress={() => navigate('/workouts')}
      >
        <WorkoutsIcon active={isActive('/workouts')} />
        <Text style={[styles.navText, isActive('/workouts') && styles.activeNavText]}>Workouts</Text>
        {isActive('/workouts') && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/progress') && styles.activeNavItem]}
        onPress={() => navigate('/progress')}
      >
        <ProgressIcon active={isActive('/progress')} />
        <Text style={[styles.navText, isActive('/progress') && styles.activeNavText]}>Progress</Text>
        {isActive('/progress') && <View style={styles.activeDot} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('/profile') && styles.activeNavItem]}
        onPress={() => navigate('/profile')}
      >
        <ProfileIcon active={isActive('/profile')} />
        <Text style={[styles.navText, isActive('/profile') && styles.activeNavText]}>Profile</Text>
        {isActive('/profile') && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  activeNavItem: {
    backgroundColor: 'rgba(64, 128, 255, 0.1)',
  },
  navText: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4080FF',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 22,
    color: '#AAAAAA',
  },
  activeIcon: {
    color: '#4080FF',
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4080FF',
  },
});
