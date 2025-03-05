import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const { workouts, user, startWorkout, currentWeekOffset, setCurrentWeekOffset } = useAppStore();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  // Week navigation
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };
  
  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    setSelectedDay(new Date().getDay());
  };
  
  // Navigate to profile screen
  const navigateToProfile = () => {
    navigate('/profile');
  };
  
  // Get current date info
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Calculate the start date of the displayed week (Sunday)
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - dayOfWeek + (currentWeekOffset * 7));
  
  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return {
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: currentWeekOffset === 0 && i === dayOfWeek,
    };
  });
  
  // Workout schedule - in a real app this would be dynamic
  // Here we're statically mapping workouts to specific days:
  // Sun: Rest, Mon: Upper Push, Tue: Lower Body, Wed: Rest
  // Thu: Upper Pull, Fri: Full Body, Sat: Rest
  const getWorkoutForDay = (dayIndex: number) => {
    const schedule = [
      { workoutId: 'rest-day', isRest: true },       // Sunday - Rest
      { workoutId: 'upper-push', isRest: false },    // Monday - Upper Push
      { workoutId: 'lower-body', isRest: false },    // Tuesday - Lower Body
      { workoutId: 'rest-day', isRest: true },       // Wednesday - Rest
      { workoutId: 'upper-pull', isRest: false },    // Thursday - Upper Pull
      { workoutId: 'full-body', isRest: false },     // Friday - Full Body
      { workoutId: 'rest-day', isRest: true }        // Saturday - Rest
    ];
    
    return schedule[dayIndex];
  };

  const handleStartWorkout = () => {
    const dayPlan = getWorkoutForDay(selectedDay);
    const workout = workouts.find(w => w.id === dayPlan.workoutId);
    
    if (workout) {
      startWorkout(workout);
      navigate('/active-workout');
    }
  };

  const selectedDayPlan = getWorkoutForDay(selectedDay);
  const selectedWorkout = workouts.find(w => w.id === selectedDayPlan.workoutId);
  
  // Format the week range for display (e.g., "March 10 - 16, 2025")
  const weekStartFormatted = currentWeekStart.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });
  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(currentWeekStart.getDate() + 6);
  const weekEndFormatted = weekEndDate.toLocaleDateString('en-US', { 
    day: 'numeric', 
    year: 'numeric' 
  });
  const weekRangeDisplay = `${weekStartFormatted} - ${weekEndFormatted}`;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.subGreeting}>Let's crush your goals today! 💪</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarCircle} 
            onPress={navigateToProfile}
            accessibilityLabel="Go to profile"
          >
            <Text style={styles.avatarText}>{user?.name ? user.name[0] : 'U'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.weight || 0}lb</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.weekHeader}>
            <Text style={styles.sectionTitle}>Your Week</Text>
            <View style={styles.weekControls}>
              <TouchableOpacity 
                style={styles.weekNavButton} 
                onPress={goToPreviousWeek}
              >
                <Text style={styles.weekNavButtonText}>◀</Text>
              </TouchableOpacity>
              
              {currentWeekOffset !== 0 && (
                <TouchableOpacity 
                  style={styles.todayButton} 
                  onPress={goToCurrentWeek}
                >
                  <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.weekNavButton} 
                onPress={goToNextWeek}
              >
                <Text style={styles.weekNavButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.weekRange}>{weekRangeDisplay}</Text>
          
          <View style={styles.weekContainer}>
            {weekDays.map((day, index) => {
              const dayPlan = getWorkoutForDay(index);
              const isSelected = selectedDay === index;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dayCard, 
                    isSelected && styles.selectedDayCard,
                    day.isToday && styles.todayCard
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <Text 
                    style={[
                      styles.dayText, 
                      isSelected && styles.selectedDayText,
                      day.isToday && styles.todayText
                    ]}
                  >
                    {day.dayNum}
                  </Text>
                  <Text 
                    style={[
                      styles.dayLabel, 
                      isSelected && styles.selectedDayText,
                      day.isToday && styles.todayText
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <View 
                    style={[
                      styles.dot, 
                      dayPlan.isRest ? styles.restDot : styles.workoutDot,
                      // Show completed dot if in the past (simplified logic for demo)
                      currentWeekOffset < 0 || (currentWeekOffset === 0 && index < dayOfWeek) ? styles.completedDot : null
                    ]} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {weekDays[selectedDay].dayName}'s Workout
          </Text>
          {selectedDayPlan.isRest ? (
            <View style={styles.restDayCard}>
              <Text style={styles.restDayIcon}>🧘</Text>
              <Text style={styles.restDayTitle}>Rest Day</Text>
              <Text style={styles.restDayDescription}>
                Active recovery - walking, swimming, or stretching
              </Text>
            </View>
          ) : (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutTitle}>
                {selectedWorkout?.name || 'No Workout'}
              </Text>
              <Text style={styles.workoutDescription}>
                {selectedWorkout?.description || ''}
              </Text>
              
              {selectedWorkout && (
                <>
                  <View style={styles.workoutMetrics}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{selectedWorkout.exercises.length}</Text>
                      <Text style={styles.metricLabel}>Exercises</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{Math.round(selectedWorkout.duration / 60)}</Text>
                      <Text style={styles.metricLabel}>Minutes</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{selectedWorkout.caloriesBurned}</Text>
                      <Text style={styles.metricLabel}>Calories</Text>
                    </View>
                  </View>

                  <View style={styles.exerciseList}>
                    {selectedWorkout.exercises.map((exercise, index) => (
                      <View key={index} style={styles.exerciseItem}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.exerciseContent}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetail}>
                            {exercise.equipment}
                            {exercise.sets.length > 0 && exercise.sets[0].duration 
                              ? ` • ${exercise.sets.length} x ${exercise.sets[0].duration}s` 
                              : ` • ${exercise.sets.length} x ${exercise.sets[0].reps} reps`
                            }
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.startButton} 
                    onPress={handleStartWorkout}
                  >
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityLabel}>Workouts Completed</Text>
              <Text style={styles.activityValue}>0/4</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
          </View>
        </View>
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
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 4,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4080FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  section: {
    marginBottom: 24,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  weekControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekNavButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  weekNavButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  todayButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  weekRange: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCard: {
    alignItems: 'center',
    width: 40,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
  },
  selectedDayCard: {
    backgroundColor: '#4080FF',
    transform: [{ scale: 1.1 }],
    elevation: 4,
    shadowColor: '#4080FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#4080FF',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#FFFFFF',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginTop: 4,
  },
  workoutDot: {
    backgroundColor: '#4CAF50',
  },
  restDot: {
    backgroundColor: '#FFB74D',
  },
  completedDot: {
    backgroundColor: '#4080FF',
  },
  workoutCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  workoutMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  startButton: {
    backgroundColor: '#4080FF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  restDayCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  restDayIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  restDayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  restDayDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#4080FF',
    borderRadius: 4,
  },
});
