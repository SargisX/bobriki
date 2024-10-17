import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./solution.module.css"

interface Params extends Record<string, string | undefined> {
    timestamp: string
}

export const SolutionPage: React.FC = () => {
    const { timestamp } = useParams<Params>()
    const [steps, setSteps] = useState<number[][][]>([])
    const [solution, setSolution] = useState<number[]>([])

    const formattedDate = new Date(parseInt(`${timestamp}`)).toLocaleString()

    useEffect(() => {
        const storedSteps = JSON.parse(localStorage.getItem("gaussianSteps") || "[]")
        const storedSolution = JSON.parse(localStorage.getItem("gaussianSolution") || "[]")

        if (Array.isArray(storedSteps)) {
            setSteps(storedSteps)
        }
        if (Array.isArray(storedSolution)) {
            setSolution(storedSolution)
        }
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Solution Page</h1>
            <p className={styles.date}>Solution generated at: {formattedDate}</p>

            <h2 className={styles.sectionTitle}>Steps of Gaussian Elimination</h2>
            {steps.map((stepMatrix, stepIndex) => (
                <div key={stepIndex} className={styles.stepContainer}>
                    <h3>Step {stepIndex + 1}</h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <tbody>
                                {stepMatrix.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((value, j) => (
                                            <td key={j}>{value.toFixed(0)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {solution.length > 0 ? (
                <div>
                    <h2 className={styles.sectionTitle}>Final Solution</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <tbody>
                                {solution.map((x, i) => (
                                    <tr key={i}>
                                        <td>{`x${i + 1}`}</td>
                                        <td>{x.toFixed(0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No solution available.</p> 
            )}

        </div>
    )
}
