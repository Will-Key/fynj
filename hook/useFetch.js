import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetch = (query) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const options = {
    method: 'GET',
    url: `https://jobicy.p.rapidapi.com/api/v2/remote-jobs`,
    params: {
      ...query,
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
      setData(response.data.jobs)
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

  return { data, isLoading, error, refetch }
}

export default useFetch
