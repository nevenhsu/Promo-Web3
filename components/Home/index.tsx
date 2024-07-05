'use client'

import { useState } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { Link } from '@/navigation'
import { Group, Box } from '@mantine/core'

export default function Home() {
  const { data, _id } = useAppSelector(state => state.user)

  return <></>
}
