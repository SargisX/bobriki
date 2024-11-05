import React, { useState, useEffect, useRef } from 'react'
import styles from './terminal.module.css'
import { deleteUser, getAllUsers, getUserById, updateUser } from '../users/users.api'
import { useNavigate } from 'react-router-dom'
import { clearSession } from '../users/auth/authUtils'

interface User {
    id: string
    username: string
    password: string
    role: string
}

interface Command {
    text: string
    isError?: boolean
}

const Terminal: React.FC = () => {
    const [input, setInput] = useState<string>('')
    const [commands, setCommands] = useState<Command[]>([])
    const [editingProperty, setEditingProperty] = useState<string | null>(null)
    const [passwordCheck, setPasswordCheck] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()


    const getCurrentUser = async (): Promise<User | null> => {
        const sessionData = localStorage.getItem('user_session')
        const currentUserId = sessionData ? JSON.parse(sessionData).userId : null

        if (!currentUserId) return null

        return await getUserById(currentUserId)
    }



    const handleCleanUsers = async () => {
        try {
            const users = await getAllUsers()
            const nonAdminUsers = users.filter(user => user.role !== 'admin')

            if (nonAdminUsers.length === 0) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'No non-admin users found to delete.' },
                ])
                return
            }


            await Promise.all(nonAdminUsers.map(user => deleteUser(user.id)))

            setCommands((prev) => [
                ...prev,
                { text: 'All non-admin users deleted successfully from the API.' },
            ])


            const currentUser = await getCurrentUser()
            
            
            if (currentUser && currentUser.role !== 'admin') {
                clearSession()
                navigate('/')
            }
        } catch (error) {
            setCommands((prev) => [
                ...prev,
                { text: 'Error deleting users.', isError: true },
            ])
        }
    }


    const handleCleanAllUsers = async () => {
        try {
            const users = await getAllUsers()

            if (users.length === 0) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'No users found to delete.' },
                ])
                return
            }

            await Promise.all(users.map(user => deleteUser(user.id)))

            setCommands((prev) => [
                ...prev,
                { text: 'All users deleted successfully from the API.' },
            ])

            clearSession()
            navigate('/')
        } catch (error) {
            setCommands((prev) => [
                ...prev,
                { text: 'Error deleting all users.', isError: true },
            ])
        }
    }


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
    }


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (editingProperty) {
                handleEditInput()
            } else if (input.trim()) {
                setCommands((prev) => [...prev, { text: `> ${input}` }])
                handleCommand(input.trim())
                setInput('')
            }
        }
    }


    const handleEditInput = async () => {
        const user = await getCurrentUser()
        if (!user) {
            setCommands((prev) => [
                ...prev,
                { text: 'No user found in the API.', isError: true },
            ])
            return
        }

        if (editingProperty === 'username') {
            const updatedUser = { ...user, username: input }
            await updateUser(updatedUser)
            setCommands((prev) => [
                ...prev,
                { text: `Username updated to: ${input}` },
            ])
            setEditingProperty(null)
        } else if (editingProperty === 'password') {
            if (passwordCheck) {
                const updatedUser = { ...user, password: input }
                await updateUser(updatedUser)
                setCommands((prev) => [
                    ...prev,
                    { text: 'Password changed successfully.' },
                ])
                setEditingProperty(null)
                setPasswordCheck(false)
            } else if (input === user.password) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'Current password verified. Enter new password:' },
                ])
                setPasswordCheck(true)
            } else {
                setCommands((prev) => [
                    ...prev,
                    { text: 'Incorrect current password.', isError: true },
                ])
                setEditingProperty(null)
            }
        }
        setInput('')
    }


    const handleCommand = async (command: string) => {
        const [cmd, property, action] = command.toLowerCase().split('.')

        if (cmd === 'user') {
            const user = await getCurrentUser()
            if (!user) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'No user found in the API.', isError: true },
                ])
                return
            }

            switch (property) {
                case 'username':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Username: ${user.username}` },
                    ])
                    break
                case 'role':
                    setCommands((prev) => [
                        ...prev,
                        { text: `User Role: ${user.role}` },
                    ])
                    break
                case 'password':
                case 'id':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Access denied: ${property} is protected.`, isError: true },
                    ])
                    break
                case 'edit':
                    if (action === 'username') {
                        setEditingProperty('username')
                        setCommands((prev) => [
                            ...prev,
                            { text: 'Enter new username:' },
                        ])
                    } else if (action === 'password') {
                        setEditingProperty('password')
                        setCommands((prev) => [
                            ...prev,
                            { text: 'Enter current password:' },
                        ])
                    } else {
                        setCommands((prev) => [
                            ...prev,
                            { text: `Cannot edit ${action}.`, isError: true },
                        ])
                    }
                    break
                default:
                    setCommands((prev) => [
                        ...prev,
                        { text: `Invalid user property: ${property}`, isError: true },
                    ])
                    break
            }
        } else if (cmd === 'users') {
            const user = await getCurrentUser()

            if (!user) {
                setCommands((prev) => [
                    ...prev,
                    { text: 'No user found in the API.', isError: true },
                ])
                return
            }
            switch (property) {
                case 'clean':
                    if (action === 'all') {
                        handleCleanAllUsers()
                    } else {
                        handleCleanUsers()
                    }
                    break
                default:
                    setCommands((prev) => [
                        ...prev,
                        { text: `Invalid user property: ${property}`, isError: true },
                    ])
                    break
            }
        } else {
            switch (cmd) {
                case 'help':
                    setCommands((prev) => [
                        ...prev,
                        { text: 'Available commands:' },
                        { text: '----------------------------------------------------' },
                        { text: '👤 User Commands:' },
                        { text: '  ✦ user.username          ➔ Display the username' },
                        { text: '  ✦ user.role             ➔ Display the user role' },
                        { text: '  ✦ user.edit.username    ➔ Edit the username' },
                        { text: '  ✦ user.edit.password    ➔ Change the password' },
                        { text: '----------------------------------------------------' },
                        { text: '🛠️ Utility Commands:' },
                        { text: '  ✦ clear                 ➔ Clear the terminal' },
                        { text: '  ✦ date                  ➔ Show the current date and time' },
                        { text: '  ✦ echo [text]           ➔ Repeat the input text' },
                        { text: '  ✦ version               ➔ Show the terminal version' },
                        { text: '----------------------------------------------------' },
                        { text: '👨‍💼 Admin Commands:' },
                        { text: '  ✦ users.clean           ➔ Delete all users from the API' },
                        { text: '  ✦ users.clean.all       ➔ Delete all non-admin users from the API' },
                    ])
                    break
                case 'clear':
                    setCommands([])
                    break
                case 'date':
                    setCommands((prev) => [
                        ...prev,
                        { text: `Current Date & Time: ${new Date().toLocaleString()}` },
                    ])
                    break
                case 'echo':
                    setCommands((prev) => [
                        ...prev,
                        { text: input.substring(5) },
                    ])
                    break
                case 'version':
                    setCommands((prev) => [
                        ...prev,
                        { text: 'Terminal Version: 1.0.0' },
                    ])
                    break
                default:
                    setCommands((prev) => [
                        ...prev,
                        { text: `Unknown command: ${cmd}`, isError: true },
                    ])
                    break
            }
        }
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
            <div>
                {commands.map((cmd, index) => (
                    <p
                        key={index}
                        className={`${styles.command} ${cmd.isError ? styles.error : ''}`}
                    >
                        {cmd.text}
                    </p>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <span className={styles.prompt}>{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
            </div>
        </div>
    )
}

export default Terminal