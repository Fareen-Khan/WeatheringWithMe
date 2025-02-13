import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function Card() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>card</Text>
      <Text style={styles.textStyle}>card</Text>
      <Text style={styles.textStyle}>card</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1 / 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    gap: 10,
  },
  textStyle: {
    backgroundColor: '#565656',
  },
})