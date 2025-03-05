import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../store';

export default function ProgressScreen() {
  const { progress, user } = useAppStore();
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'history'
  const days = ['W', 'T', 'F', 'S', 'S', 'M', 'T'];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]} 
            onPress={() => setActiveTab('activity')}
          >
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'activity' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Workouts</Text>
              <View style={styles.chartContainer}>
                <View style={styles.chart}>
                  {/* Empty chart placeholder */}
                </View>
                <View style={styles.daysContainer}>
                  {days.map((day, index) => (
                    <Text key={index} style={styles.dayLabel}>{day}</Text>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
            </View>
          </>
        )}
        
        {activeTab === 'history' && (
          <View style={styles.historyContainer}>
            <Text style={styles.emptyText}>No workout history yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4080FF',
  },
  tabText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  chart: {
    height: 200, // Placeholder for the actual chart
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dayLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  historyContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
});
