import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'
import { Text, SafeAreaView } from 'react-native'
import axios from 'axios'

import { ScreenHeaderBtn, NearbyJobCard } from '../../components'
import { COLORS, icons, SIZES } from '../../constants'
import styles from '../../styles/search'

const JobSearch = () => {
  const params = useLocalSearchParams()
  const router = useRouter()

  const [searchResult, setSearchResult] = useState([])
  const [searchLoader, setSearchLoader] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [count, setCount] = useState(10)

  const handleSearch = async (c) => {
    setSearchLoader(true)
    setSearchResult([])

    try {
      const options = {
        method: 'GET',
        url: `https://jobicy.p.rapidapi.com/api/v2/remote-jobs`,
        headers: {
          'X-RapidAPI-Key':
            'c07a088d6fmsh79964970de4e445p1b9c92jsn4347b9b69552',
          'X-RapidAPI-Host': 'jobicy.p.rapidapi.com',
        },
        params: {
          tag: params.tag,
          count: c ? c.toString() : '10',
        },
      }

      const response = await axios.request(options)
      const jobs = response.data.jobs
      if (jobs.length > 0) setSearchResult(jobs)
      else setSearchError(jobs.message)
    } catch (error) {
      setSearchError(error)
      console.log(error)
    } finally {
      setSearchLoader(false)
    }
  }

  const handlePagination = (direction) => {
    if (direction === 'left' && count > 10) {
      setCount((v) => v - 10)
      handleSearch(count - 10)
    } else if (direction === 'right') {
      setCount((v) => v + 10)
      handleSearch(count + 10)
    }
  }

  const handleNavigate = (job) => {
    const param = job.id + '-' + params.tag + '-' + count
    router.push(`/job-details/${param}`)
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: '',
        }}
      />

      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            key={`nearby-job-${item.id}`}
            handleNavigate={handleNavigate}
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{params.tag}</Text>
              <Text style={styles.noOfSearchedJobs}>Job Opportunities</Text>
            </View>
            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                searchError && (
                  <Text>
                    {searchError ? searchError : 'Oops something went wrong'}
                  </Text>
                )
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination('left')}>
              <Text style={styles.paginationImage}>-10</Text>
            </TouchableOpacity>
            <View style={styles.paginationTextBox}>
              <Text style={styles.paginationText}>{count}</Text>
            </View>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePagination('right')}>
              <Text style={styles.paginationImage}>+10</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default JobSearch
