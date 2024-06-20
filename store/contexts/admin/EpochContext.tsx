'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import {
  getAllEpochs,
  createEpoch as _createEpoch,
  updateEpoch as _updateEpoch,
  deleteEpoch as _deleteEpoch,
} from '@/services/private/epoch'
import type { TEpoch, Epoch } from '@/models/epoch'

interface EpochContextType {
  epochs: TEpoch[]
  selectedIndex: number | undefined
  selectedEpoch: TEpoch | undefined
  loading: boolean
  setSelectedIndex: (index: number) => void
  fetchEpochs: () => void
  createEpoch: (startTime: Date, endTime: Date) => Promise<TEpoch | undefined>
  updateEpoch: (index: number, updateData: Partial<Epoch>) => Promise<TEpoch | undefined>
  deleteEpoch: (index: number) => Promise<TEpoch | undefined>
}

const EpochContext = createContext<EpochContextType | undefined>(undefined)

export const EpochProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [epochs, setEpochs] = useState<TEpoch[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const selectedEpoch = useMemo(() => {
    return epochs.find(o => o.index === selectedIndex)
  }, [selectedIndex, epochs])

  const fetchEpochs = async () => {
    try {
      setLoading(true)
      const epochs = await getAllEpochs()
      if (epochs) {
        setEpochs(epochs)
      }
    } catch (error) {
      console.error('Error fetching epochs:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEpoch = async (startTime: Date, endTime: Date) => {
    try {
      setLoading(true)
      const epoch = await _createEpoch(startTime, endTime)
      if (epoch) {
        setEpochs(prev => [epoch, ...prev])
        return epoch
      }
    } catch (error) {
      console.error('Error creating epoch:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEpoch = async (index: number, updateData: Partial<Epoch>) => {
    try {
      setLoading(true)
      const updated = await _updateEpoch(index, updateData)
      if (updated) {
        setEpochs(prev => prev.map(o => (o.index === index ? { ...o, ...updated } : o)))
        return updated
      }
    } catch (error) {
      console.error('Error updating epoch:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEpoch = async (index: number) => {
    try {
      setLoading(true)
      const deleted = await _deleteEpoch(index)
      if (deleted) {
        setEpochs(prev => prev.filter(o => o.index !== index))
        return deleted
      }
    } catch (error) {
      console.error('Error deleting epoch:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEpochs()
  }, [])

  return (
    <EpochContext.Provider
      value={{
        epochs,
        selectedIndex,
        selectedEpoch,
        loading,
        setSelectedIndex,
        fetchEpochs,
        createEpoch,
        updateEpoch,
        deleteEpoch,
      }}
    >
      {children}
    </EpochContext.Provider>
  )
}

export const useEpoch = (): EpochContextType => {
  const context = useContext(EpochContext)
  if (context === undefined) {
    throw new Error('useEpoch must be used within an EpochProvider')
  }
  return context
}
