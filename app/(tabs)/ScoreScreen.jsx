import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const snakeValues = {
  'Snake 1': -800000,
  'Snake 2': -500000,
  'Snake 3': -600000,
  'Snake 4': -400000,
  'Snake 5': -300000,
  'Snake 6': -700000,
  'Snake 7': -800000,
  'Snake 8': -1000000,
};

const ladderValues = {
  'Ladder 1': 600000,
  'Ladder 2': 1000000,
  'Ladder 3': 600000,
  'Ladder 4': 800000,
  'Ladder 5': 800000,
  'Ladder 6': 600000,
  'Ladder 7': 1000000,
};

const UnifiedScoreScreen = () => {
  const [teamNumber, setTeamNumber] = useState('');
  const [initialScore, setInitialScore] = useState('');
  const [selectedSnake, setSelectedSnake] = useState('');
  const [selectedLadder, setSelectedLadder] = useState('');
  const [currentClockPosition, setCurrentClockPosition] = useState(0); // Initial clock position set to 0
  const [score, setScore] = useState(0);
  const [stepInput, setStepInput] = useState(''); // State for step input

  useEffect(() => {
    const loadScore = async () => {
      const storedScore = await AsyncStorage.getItem(`team_${teamNumber}_score`);
      if (storedScore) {
        setScore(parseInt(storedScore));
      }
    };

    if (teamNumber) {
      loadScore();
    }
  }, [teamNumber]);

  // Handle team number submission
  const handleTeamNumberSubmit = () => {
    Alert.alert('Team Number', `Team number: ${teamNumber}`);
  };

  // Handle clock score calculation with step input
  const calculateClockScore = () => {
    const step = parseInt(stepInput) || 1; // Default to 1 if input is not a number
    let newPosition = (currentClockPosition + step) % 12; // Move steps

    if (newPosition === 0) {
      setScore(prevScore => {
        const updatedScore = prevScore + 1020000; // Add 10 lakh 20 thousand
        storeScore(updatedScore); // Store the updated score
        return updatedScore;
      });
    }

    // Alert user about the new clock position and updated score
    Alert.alert(
      'Clock Score Updated',
      `Current Clock Position: ${newPosition === 0 ? 12 : newPosition}\nCurrent Score: ${score.toLocaleString('en-IN')}`,
    );

    setCurrentClockPosition(newPosition);
  };

  // Store score in AsyncStorage
  const storeScore = async (newScore) => {
    await AsyncStorage.setItem(`team_${teamNumber}_score`, newScore.toString());
  };

  // Handle score updates
  const updateScore = () => {
    let updatedScore = score;

    if (selectedSnake) {
      updatedScore += snakeValues[selectedSnake];
    }

    if (selectedLadder) {
      updatedScore += ladderValues[selectedLadder];
    }

    Alert.alert(
      'Confirm Update',
      `You are updating the score with:\n- Team Number: ${teamNumber}\n- Snake: ${selectedSnake}\n- Ladder: ${selectedLadder}\nNew Score: ${updatedScore.toLocaleString('en-IN')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {
            setScore(updatedScore);
            storeScore(updatedScore); // Store the updated score
          } 
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Team Number Input */}
      <Text style={styles.label}>Enter Team Number:</Text>
      <TextInput
        style={styles.input}
        value={teamNumber}
        onChangeText={setTeamNumber}
        placeholder="Team Number"
        keyboardType="numeric"
      />
      <Button title="Submit Team Number" onPress={handleTeamNumberSubmit} color="#007BFF" />

      {/* Ask for Initial Score */}
      <Text style={styles.label}>Enter Initial Score:</Text>
      <TextInput
        style={styles.input}
        value={initialScore}
        onChangeText={setInitialScore}
        placeholder="Initial Score"
        keyboardType="numeric"
      />

      <Button title="Start Game" onPress={() => setScore(parseInt(initialScore) || 0)} color="#28A745" />

      {/* Display Selected Values */}
      <Text style={styles.selectedValues}>
        Selected Snake: {selectedSnake || 'None'}, Selected Ladder: {selectedLadder || 'None'}
      </Text>

      {/* Step Input for Clock Score */}
      <Text style={styles.label}>Enter Steps to Move:</Text>
      <TextInput
        style={styles.input}
        value={stepInput}
        onChangeText={setStepInput}
        placeholder="Number of Steps"
        keyboardType="numeric"
      />
      <Button title="Calculate Clock Score" onPress={calculateClockScore} color="#28A745" />
      <Text style={styles.score}>Current Clock Position: {currentClockPosition === 0 ? 12 : currentClockPosition}</Text>

      {/* Snake and Ladder Score Input */}
      <Text style={styles.label}>Current Score: {score.toLocaleString('en-IN')}</Text>

      <Text style={styles.label}>Select Snake:</Text>
      <Picker
        selectedValue={selectedSnake}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedSnake(itemValue)}
      >
        <Picker.Item label="None" value="" />
        {Object.keys(snakeValues).map((snake) => (
          <Picker.Item label={snake} value={snake} key={snake} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Ladder:</Text>
      <Picker
        selectedValue={selectedLadder}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedLadder(itemValue)}
      >
        <Picker.Item label="None" value="" />
        {Object.keys(ladderValues).map((ladder) => (
          <Picker.Item label={ladder} value={ladder} key={ladder} />
        ))}
      </Picker>

      <Button title="Update Snake and Ladder Score" onPress={updateScore} color="#FFC107" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center', // Center content vertically
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#343A40',
  },
  input: {
    height: 50,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedValues: {
    marginBottom: 20,
    fontSize: 16,
    color: '#495057',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  score: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
  },
});

export default UnifiedScoreScreen;
