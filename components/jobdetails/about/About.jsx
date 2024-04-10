import React from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

import styles from './about.style'

const About = ({ info }) => {
  const { width } = useWindowDimensions()
  return (
    <View style={styles.container}>
      <Text style={styles.headText}>About</Text>
      <View>
        <Text style={styles.pointText}>
          <RenderHtml contentWidth={width} source={{ html: info }} />
        </Text>
      </View>
    </View>
  )
}

export default About
