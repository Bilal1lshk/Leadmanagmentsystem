"use client"
import { useEffect } from 'react'
import { GetuserId } from '../../../context/Usercontext.jsx'

export default function SourcedClient({ userAgent }) {
  const { setUserId } = GetuserId()

  useEffect(() => {
    setUserId(userAgent)
  }, [userAgent, setUserId])

  return <div></div>
}