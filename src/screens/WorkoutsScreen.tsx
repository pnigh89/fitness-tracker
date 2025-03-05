import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Workout } from '../types';

export default function WorkoutsScreen() {
  const { workouts, startWorkout } = useAppStore();
  const navigate = useNavigate();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const handleStartWorkout = (workout: Workout) => {
    startWorkout(workout);
    navigate('/active-workout');
  };

  const toggleWorkoutExpansion = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const getWorkoutDuration = (workout: Workout) => {
    const minutes = Math.round(workout.duration / 60);
    return `${minutes} min`;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Library</Text>
          <Text style={styles.subtitle}>Choose a workout to begin your session</Text>
        </View>
        
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
              <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Upper Body</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Lower Body</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Core</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Cardio</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {workouts && workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutCard}>
              <TouchableOpacity 
                style={styles.workoutHeader}
                onPress={() => toggleWorkoutExpansion(workout.id)}
              >
                <View>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDescription}>
                    {workout.exercises.length} exercises • {getWorkoutDuration(workout)}
                  </Text>
                </View>
                <Text style={styles.chevron}>
                  {expandedWorkout === workout.id ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {expandedWorkout === workout.id && (
                <View style={styles.workoutExpanded}>
                  <View style={styles.exercisesList}>
                    {workout.exercises.map((exercise, idx) => (
                      <View key={exercise.id} style={styles.exerciseItem}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{idx + 1}</Text>
                        </View>
                        <View style={styles.exerciseContent}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetail}>
                            {exercise.sets.length} sets • {exercise.sets[0].reps} reps • {exercise.sets[0].weight} lbs
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>{workout.exercises.length} exercises</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>{getWorkoutDuration(workout)}</Text>
                </View>
              </View>
              
              <View style={styles.tagsContainer}>
                {workout.exercises.slice(0, 3).map((exercise) => (
                  <View key={exercise.id} style={styles.tag}>
                    <Text style={styles.tagText}>{exercise.name.split(' ')[0]}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.workoutFooter}>
                <Text style={styles.lastPerformedText}>Last: Never</Text>
                <TouchableOpacity 
                  style={styles.startButton} 
                  onPress={() => handleStartWorkout(workout)}
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Text style={styles.noWorkoutsText}>No workouts available</Text>
            <Text style={styles.noWorkoutsSubtext}>Create your first workout to get started</Text>
          </View>
        )}
        
        <View style={styles.restDayCard}>
          <Text style={styles.restDayIcon}>🧘</Text>
          <Text style={styles.restDayTitle}>Rest Day</Text>
          <Text style={styles.restDayDescription}>Active recovery - walking, swimming, or stretching</Text>
          <View style={styles.restBenefits}>
            <Text style={styles.benefitTitle}>Benefits:</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitDot}>•</Text>
              <Text style={styles.benefitText}>Muscle recovery and growth</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitDot}>•</Text>
              <Text style={styles.benefitText}>Reduced risk of injury</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitDot}>•</Text>
              <Text style={styles.benefitText}>Mental refreshment</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.createWorkoutButton}>
          <Text style={styles.createWorkoutText}>Create Custom Workout</Text>
        </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#4080FF',
  },
  filterText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  workoutCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  chevron: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  workoutExpanded: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 16,
  },
  exercisesList: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  workoutDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tagText: {
    color: '#4080FF',
    fontSize: 14,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastPerformedText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#4080FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  restDayCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
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
    marginBottom: 16,
  },
  restBenefits: {
    alignSelf: 'stretch',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitDot: {
    color: '#4080FF',
    fontSize: 18,
    marginRight: 8,
  },
  benefitText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  noWorkoutsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noWorkoutsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noWorkoutsSubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  createWorkoutButton: {
    backgroundColor: '#4080FF',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  createWorkoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
