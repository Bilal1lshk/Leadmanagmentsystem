import React, { useContext, useState, useContext } from 'react'
export default function Userprovider({ children }) {
    const [userId, setUserId] = useState(null)

    const UserId = useContext()
    return (
        <UserId.provider value={{ userId, setUserId }}>
            {children}
        </UserId.provider>
    )
}
export function GetuserId() {
    useContext(UserId)
}
