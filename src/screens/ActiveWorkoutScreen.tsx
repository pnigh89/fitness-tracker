import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function ActiveWorkoutScreen() {
  const { activeWorkout, endWorkout } = useAppStore();
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [editedSets, setEditedSets] = useState<{[key: string]: {reps: number, weight: number, completed: boolean}[]}>({});
  const [showTimer, setShowTimer] = useState<{[key: string]: boolean}>({});
  const [customTimerDuration, setCustomTimerDuration] = useState<{[key: string]: number}>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize edited sets with current workout data
  useEffect(() => {
    if (activeWorkout) {
      const initialEditedSets: {[key: string]: {reps: number, weight: number, completed: boolean}[]} = {};
      const initialShowTimer: {[key: string]: boolean} = {};
      const initialCustomTimerDuration: {[key: string]: number} = {};
      
      activeWorkout.exercises.forEach(exercise => {
        initialEditedSets[exercise.id] = exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          completed: set.completed
        }));
        
        // Initialize timer visibility based on whether exercise has duration
        initialShowTimer[exercise.id] = exercise.sets.some(set => set.duration);
        
        // Set default custom timer duration
        initialCustomTimerDuration[exercise.id] = exercise.sets.some(set => set.duration) 
          ? (exercise.sets.find(set => set.duration)?.duration || 60)
          : 60;
      });
      
      setEditedSets(initialEditedSets);
      setShowTimer(initialShowTimer);
      setCustomTimerDuration(initialCustomTimerDuration);
    }
  }, [activeWorkout]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, []);

  if (!activeWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.noWorkoutText}>No active workout. Start a workout from the home screen.</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigate('/')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentExercise = activeWorkout.exercises[currentExerciseIndex];
  
  const startTimer = (duration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setTimer(duration);
    setTimeRemaining(duration);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Play sound or vibrate here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const startRestTimer = () => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    
    const restDuration = 60; // 60 seconds rest
    setIsRestTimerActive(true);
    setRestTimeRemaining(restDuration);
    
    restTimerRef.current = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          if (restTimerRef.current) clearInterval(restTimerRef.current);
          setIsRestTimerActive(false);
          // Play sound or vibrate here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSetComplete = (exerciseId: string, setIndex: number) => {
    const updatedSets = {...editedSets};
    
    if (updatedSets[exerciseId]) {
      updatedSets[exerciseId][setIndex].completed = !updatedSets[exerciseId][setIndex].completed;
      setEditedSets(updatedSets);
      
      // If completing a set, start the rest timer
      if (updatedSets[exerciseId][setIndex].completed) {
        startRestTimer();
      }
    }
  };

  const handleUpdateWeight = (exerciseId: string, setIndex: number, weight: number) => {
    const updatedSets = {...editedSets};
    
    if (updatedSets[exerciseId]) {
      updatedSets[exerciseId][setIndex].weight = weight;
      setEditedSets(updatedSets);
    }
  };

  const handleUpdateReps = (exerciseId: string, setIndex: number, reps: number) => {
    const updatedSets = {...editedSets};
    
    if (updatedSets[exerciseId]) {
      updatedSets[exerciseId][setIndex].reps = reps;
      setEditedSets(updatedSets);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      
      // Reset timers
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(null);
      
      // Scroll to top when changing exercises
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      
      // Reset timers
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(null);
      
      // Scroll to top when changing exercises
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const handleFinishWorkout = () => {
    if (window.confirm('Are you sure you want to finish this workout?')) {
      endWorkout();
      navigate('/');
    }
  };
  
  const toggleTimer = (exerciseId: string) => {
    setShowTimer(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
    
    // If we're hiding the timer, stop it
    if (showTimer[exerciseId] && timerRef.current) {
      clearInterval(timerRef.current);
      setTimer(null);
    }
  };
  
  const updateCustomTimerDuration = (exerciseId: string, duration: number) => {
    setCustomTimerDuration(prev => ({
      ...prev,
      [exerciseId]: duration
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Check if all sets of current exercise are completed
  const isCurrentExerciseComplete = editedSets[currentExercise.id]?.every(set => set.completed) || false;

  // Calculate progress percentage
  const completedExercises = activeWorkout.exercises.filter(ex => 
    editedSets[ex.id]?.every(set => set.completed)
  ).length;
  
  const progressPercentage = (completedExercises / activeWorkout.exercises.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeWorkout.name}</Text>
        <Text style={styles.headerSubtitle}>{activeWorkout.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedExercises}/{activeWorkout.exercises.length} exercises
          </Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseCount}>
              Exercise {currentExerciseIndex + 1}/{activeWorkout.exercises.length}
            </Text>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
            <Text style={styles.equipmentText}>Equipment: {currentExercise.equipment}</Text>
          </View>
          
          {/* Exercise image placeholder - would be a real image in a production app */}
          <View style={styles.exerciseImageContainer}>
            <Text style={styles.exerciseImagePlaceholder}>💪</Text>
          </View>
        </View>

        {/* Timer toggle button */}
        <TouchableOpacity 
          style={styles.timerToggleButton} 
          onPress={() => toggleTimer(currentExercise.id)}
        >
          <Text style={styles.timerToggleText}>
            {showTimer[currentExercise.id] ? 'Hide Timer' : 'Show Timer'}
          </Text>
        </TouchableOpacity>

        {/* Timer for exercises */}
        {showTimer[currentExercise.id] && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Timer</Text>
            <Text style={styles.timerValue}>
              {timer ? formatTime(timeRemaining) : "00:00"}
            </Text>
            
            {/* Custom timer duration input */}
            {!timer && (
              <View style={styles.customTimerContainer}>
                <Text style={styles.customTimerLabel}>Duration (seconds):</Text>
                <TextInput
                  style={styles.customTimerInput}
                  value={customTimerDuration[currentExercise.id]?.toString()}
                  onChangeText={(text) => {
                    const duration = parseInt(text) || 60;
                    updateCustomTimerDuration(currentExercise.id, duration);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            )}
            
            <View style={styles.timerControls}>
              {!timer && (
                <TouchableOpacity 
                  style={styles.timerButton} 
                  onPress={() => {
                    // Use custom duration if available, otherwise use default
                    const exerciseDuration = currentExercise.sets[0]?.duration || customTimerDuration[currentExercise.id] || 60;
                    startTimer(exerciseDuration);
                  }}
                >
                  <Text style={styles.timerButtonText}>Start Timer</Text>
                </TouchableOpacity>
              )}
              {timer && (
                <TouchableOpacity 
                  style={[styles.timerButton, { backgroundColor: '#E53935' }]} 
                  onPress={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setTimer(null);
                  }}
                >
                  <Text style={styles.timerButtonText}>Stop</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Rest timer */}
        {isRestTimerActive && (
          <View style={styles.restTimerContainer}>
            <Text style={styles.restTimerLabel}>Rest</Text>
            <Text style={styles.restTimerValue}>{formatTime(restTimeRemaining)}</Text>
            <TouchableOpacity 
              style={styles.skipRestButton} 
              onPress={() => {
                if (restTimerRef.current) clearInterval(restTimerRef.current);
                setIsRestTimerActive(false);
              }}
            >
              <Text style={styles.skipRestButtonText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.setsContainer}>
          <View style={styles.setHeaderRow}>
            <Text style={[styles.setHeaderText, styles.setCell]}>Set</Text>
            <Text style={[styles.setHeaderText, styles.weightCell]}>Weight</Text>
            <Text style={[styles.setHeaderText, styles.repsCell]}>
              {currentExercise.sets[0].duration ? 'Time' : 'Reps'}
            </Text>
            <Text style={[styles.setHeaderText, styles.statusCell]}>Status</Text>
          </View>
          
          {currentExercise.sets.map((set, index) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={[styles.setText, styles.setCell]}>{index + 1}</Text>
              
              <View style={styles.weightCell}>
                {set.weight > 0 ? (
                  <TextInput
                    style={styles.inputField}
                    value={editedSets[currentExercise.id]?.[index]?.weight.toString()}
                    onChangeText={(text) => {
                      const weight = parseInt(text) || 0;
                      handleUpdateWeight(currentExercise.id, index, weight);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                ) : (
                  <Text style={styles.setInfoText}>--</Text>
                )}
              </View>
              
              <View style={styles.repsCell}>
                {set.duration ? (
                  <Text style={styles.setInfoText}>{formatTime(set.duration)}</Text>
                ) : (
                  <TextInput
                    style={styles.inputField}
                    value={editedSets[currentExercise.id]?.[index]?.reps.toString()}
                    onChangeText={(text) => {
                      const reps = parseInt(text) || 0;
                      handleUpdateReps(currentExercise.id, index, reps);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                )}
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.statusCell, 
                  styles.statusButton, 
                  editedSets[currentExercise.id]?.[index]?.completed 
                    ? styles.completedButton 
                    : styles.incompleteButton
                ]}
                onPress={() => handleSetComplete(currentExercise.id, index)}
              >
                <Text style={styles.statusButtonText}>
                  {editedSets[currentExercise.id]?.[index]?.completed ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {currentExercise.sets.some(set => set.notes) && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            {currentExercise.sets
              .filter(set => set.notes)
              .map((set, index) => (
                <Text key={index} style={styles.notesText}>• {set.notes}</Text>
              ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navButton, currentExerciseIndex === 0 && styles.disabledButton]} 
          onPress={handlePrevExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        {isCurrentExerciseComplete && currentExerciseIndex < activeWorkout.exercises.length - 1 ? (
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]} 
            onPress={handleNextExercise}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[
              styles.navButton, 
              styles.nextButton, 
              currentExerciseIndex === activeWorkout.exercises.length - 1 && isCurrentExerciseComplete && styles.finishButton
            ]} 
            onPress={currentExerciseIndex === activeWorkout.exercises.length - 1 && isCurrentExerciseComplete ? handleFinishWorkout : handleNextExercise}
            disabled={!isCurrentExerciseComplete && currentExerciseIndex === activeWorkout.exercises.length - 1}
          >
            <Text style={styles.navButtonText}>
              {currentExerciseIndex === activeWorkout.exercises.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 4,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 6,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  exerciseInfo: {
    flex: 3,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#4080FF',
    marginBottom: 6,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 16,
    color: '#DDDDDD',
    fontWeight: '500',
  },
  exerciseImageContainer: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    height: 100,
  },
  exerciseImagePlaceholder: {
    fontSize: 40,
  },
  timerToggleButton: {
    backgroundColor: '#333333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  timerToggleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  customTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  customTimerLabel: {
    color: '#AAAAAA',
    marginRight: 10,
  },
  customTimerInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timerButton: {
    backgroundColor: '#4080FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  restTimerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  restTimerLabel: {
    fontSize: 16,
    color: '#FFB74D',
    marginBottom: 8,
  },
  restTimerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  skipRestButton: {
    backgroundColor: '#555555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  skipRestButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setsContainer: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  setHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  setHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  setRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  setInfoText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    width: '90%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  setCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightCell: {
    flex: 2,
    alignItems: 'center',
  },
  repsCell: {
    flex: 2,
    alignItems: 'center',
  },
  statusCell: {
    flex: 2,
    alignItems: 'center',
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  incompleteButton: {
    backgroundColor: '#333333',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 6,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1A1A1A',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4080FF',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  noWorkoutText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4080FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 