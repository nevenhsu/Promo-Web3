'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import {
  getAllAdmins,
  createAdmin as _createAdmin,
  updateAdmin as _updateAdmin,
  deleteAdmin as _deleteAdmin,
} from '@/services/private/admin'
import type { TAdmin } from '@/models/admin'

interface AdminContextType {
  admins: TAdmin[]
  selectedId: string | undefined
  selectedAdmin: TAdmin | undefined
  loading: boolean
  setSelectedId: (userId: string) => void
  fetchAdmins: () => void
  createAdmin: (userId: string, role: number) => Promise<TAdmin | undefined>
  updateAdmin: (userId: string, updateData: Partial<TAdmin>) => Promise<TAdmin | undefined>
  deleteAdmin: (userId: string) => Promise<TAdmin | undefined>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<TAdmin[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const selectedAdmin = useMemo(() => {
    return admins.find(o => o._user._id === selectedId)
  }, [selectedId, admins])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const admins = await getAllAdmins()
      if (admins) {
        setAdmins(admins)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAdmin = async (username: string, role: number) => {
    try {
      setLoading(true)
      const admin = await _createAdmin(username, role)
      if (admin) {
        setAdmins(prevAdmins => [...prevAdmins, admin])
        return admin
      }
    } catch (error) {
      console.error('Error creating admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAdmin = async (userId: string, updateData: Partial<TAdmin>) => {
    try {
      setLoading(true)
      const updated = await _updateAdmin(userId, updateData)
      if (updated) {
        setAdmins(prevAdmins =>
          prevAdmins.map(admin => (admin._user._id === userId ? { ...admin, ...updated } : admin))
        )
        return updated
      }
    } catch (error) {
      console.error('Error updating admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAdmin = async (userId: string) => {
    try {
      setLoading(true)
      const deleted = await _deleteAdmin(userId)
      if (deleted) {
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin._user._id !== userId))
        return deleted
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  return (
    <AdminContext.Provider
      value={{
        admins,
        selectedId,
        selectedAdmin,
        loading,
        setSelectedId: setSelectedId,
        fetchAdmins,
        createAdmin,
        updateAdmin,
        deleteAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
