import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function Search() {
  const [location, setLocation] = useState("Toronto");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" style={styles.link}>
          <Feather name="arrow-left" size={20} color="black" />
        </Link>
        <Text style={styles.headerText}>Search</Text>
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={setLocation}
        value={location}
        placeholder="Enter A Location"
      />
      <View style={styles.searchContainer}>
        <Link
          href={{
            pathname: "/",
            params: { location: location }
          }}
          style={styles.link}
        >
          <Feather name="search" size={20} color="black" />
        </Link>
        <Text style={styles.searchText}>Enter</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  link: {
    marginRight: 8
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  searchText: {
    fontSize: 16,
    marginLeft: 8
  },
});
