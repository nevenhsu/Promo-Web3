'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import {
  getAllActivities,
  createActivity as _createActivity,
  updateActivity as _updateActivity,
  deleteActivity as _deleteActivity,
} from '@/services/private/activity'
import type { TActivity, ActivityData } from '@/models/activity'

interface ActivityContextType {
  activities: TActivity[]
  selectedIndex: number | undefined
  selectedActivity: TActivity | undefined
  loading: boolean
  setSelectedIndex: (index: number) => void
  fetchActivities: () => void
  createActivity: (newData: ActivityData) => Promise<TActivity | undefined>
  updateActivity: (
    index: number,
    updateData: Partial<ActivityData>
  ) => Promise<TActivity | undefined>
  deleteActivity: (index: number) => Promise<TActivity | undefined>
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<TActivity[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const selectedActivity = useMemo(() => {
    return activities.find(o => o.index === selectedIndex)
  }, [selectedIndex, activities])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const activities = await getAllActivities()
      if (activities) {
        setActivities(activities)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const createActivity = async (newData: ActivityData) => {
    try {
      setLoading(true)
      const activity = await _createActivity(newData)
      if (activity) {
        setActivities(prev => [activity, ...prev])
        return activity
      }
    } catch (error) {
      console.error('Error creating activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateActivity = async (index: number, updateData: Partial<ActivityData>) => {
    try {
      setLoading(true)
      const updated = await _updateActivity(index, updateData)
      if (updated) {
        setActivities(prev => prev.map(o => (o.index === index ? { ...o, ...updated } : o)))
        return updated
      }
    } catch (error) {
      console.error('Error updating activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteActivity = async (index: number) => {
    try {
      setLoading(true)
      const deleted = await _deleteActivity(index)
      if (deleted) {
        setActivities(prev => prev.filter(o => o.index !== index))
        return deleted
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return (
    <ActivityContext.Provider
      value={{
        activities,
        selectedIndex,
        selectedActivity,
        loading,
        setSelectedIndex,
        fetchActivities,
        createActivity,
        updateActivity,
        deleteActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}
