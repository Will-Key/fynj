import React from 'react'
import { View, Text } from 'react-native'

import styles from './specifics.style'

const Specifics = ({ title, excerpt }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointText}>{excerpt}</Text>
      </View>
    </View>
  )
}

export default Specifics
