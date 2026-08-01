"use client"
import React, { useContext, useState, createContext } from 'react'

// create context OUTSIDE the component, at module level
const UserId = createContext()

export default function Userprovider({ children }) {
  const [userId, setUserId] = useState(null)

  return (
    <UserId.Provider value={{ userId, setUserId }}>
      {children}
    </UserId.Provider>
  )
}

export function GetuserId() {
  return useContext(UserId)  // must return the value
}