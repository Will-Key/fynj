import { useEffect, useState } from 'react'
import axios from 'axios'

const useJob = (jobId, tag, count) => {
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const options = {
    method: 'GET',
    url: `https://jobicy.p.rapidapi.com/api/v2/remote-jobs`,
    params: {
      tag,
      count,
    },
    headers: {
      'X-RapidAPI-Key': 'c07a088d6fmsh79964970de4e445p1b9c92jsn4347b9b69552',
      'X-RapidAPI-Host': 'jobicy.p.rapidapi.com',
    },
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.request(options)
      const jobs = response.data.jobs
      const job = jobs.filter((job) => job.id === Number(jobId))
      setJob(job ? job[0] : null)
    } catch (error) {
      setError(error)
      console.error(error)
      alert('This is an error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => {
    setIsLoading(true)
    fetchData()
  }

  return { job, isLoading, error, refetch }
}

export default useJob
