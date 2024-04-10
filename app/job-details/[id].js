import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from '../../components'
import { COLORS, icons, SIZES } from '../../constants'
import useJob from '../../hook/useJob'
import { DEFAULT_JOB_URL } from '../../constants/defaultUrl'

const tabs = ['About', 'Excerpt']

const JobDetails = () => {
  const params = useLocalSearchParams()
  const router = useRouter()
  const jobId = params.id.split('-')[0]
  const tag = params.id.split('-')[1]
  const count = params.id.split('-')[2]
  const { job, isLoading, error, refetch } = useJob(jobId, tag, count)

  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState(tabs[0])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
    setRefreshing(false)
  }, [])

  const displayTabContent = () => {
    switch (activeTab) {
      case 'Excerpt':
        const excerpt = job.jobExcerpt ? job.jobExcerpt : 'N/A'
        return <Specifics title="Excerpt" excerpt={excerpt} />
      case 'About':
        return <JobAbout info={job.jobDescription} />
      default:
        break
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: '',
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : job === null ? (
            <Text>No data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={job.companyLogo}
                jobTitle={job.jobTitle}
                companyName={job.companyName}
                location={job.jobGeo}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter url={job?.url ?? DEFAULT_JOB_URL} />
      </>
    </SafeAreaView>
  )
}

export default JobDetails
