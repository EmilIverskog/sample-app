import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, CheckBox } from 'react-native';
import { useNavigation, Link } from 'expo-router';
import { ItemPrototype } from '@/interfaces/itemInterface'
import { FireStoreContext } from '@/contexts/FireStoreContext';
import { AuthenticationContext

 } from '@/contexts/AuthenticationContext';

export default function HomeScreen(props: any) {
  
  const db = useContext(FireStoreContext)
  const auth = useContext(AuthenticationContext)

  const listData: ItemPrototype[] = [
    { id: 1, name: "Item1", status: true },
    { id: 2, name: "Item2", status: false },
    { id: 3, name: "Item3", status: true },
    { id: 4, name: "Item4", status: true },
    { id: 5, name: "Item5", status: false }
  ];

  const [datastate, setdatastate] = useState<ItemPrototype[]>([])

  useEffect(() => {
    if (datastate.length === 0) {
      setdatastate(listData);
    }
  }, [datastate]);

  
  const toggleHabitCompletion = (id: number) => {
    setdatastate((prevData) =>
      prevData.map((habit) =>
        habit.id === id
          ? { ...habit, status: !habit.status } 
          : habit
      )
    );
  };
  

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.habitContainer}>
        <CheckBox
          value={item.status} 
          onValueChange={() => toggleHabitCompletion(item.id)}
          />
        <Text style={[styles.habitText, item.status === "completed" && styles.completedHabit]}>
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Goals</Text>
      <FlatList
        data={datastate}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Pressable style={styles.addButton}>
      <Link href="/(tabs)/addHabit">
        <Text style={styles.addButtonText}>Add New Goal</Text>
        </Link>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  habitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  habitText: {
    fontSize: 18,
    marginLeft: 10,
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
