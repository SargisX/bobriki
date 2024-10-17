import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./gaussian_scheme.module.css"

export const GaussianSolver: React.FC = () => {
  const [size, setSize] = useState<number>(0)
  const [matrix, setMatrix] = useState<number[][]>([])
  const [solution, setSolution] = useState<number[]>([])
  const [steps, setSteps] = useState<number[][][]>([])
  const navigate = useNavigate()


  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value)
    if (!isNaN(newSize)) {
      setSize(newSize)
    }
  }


  const generateMatrix = () => {
    const newMatrix: number[][] = Array(size)
      .fill(null)
      .map(() => Array(size + 1).fill(0))
    setMatrix(newMatrix)
  }


  const handleMatrixChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value
    const newMatrix = [...matrix]

    if (value === "" || /^[\d.-]*$/.test(value)) {
      newMatrix[row][col] = value === "" ? 0 : parseFloat(value)
      setMatrix(newMatrix)
    }
  }


  const gaussianElimination = () => {
    const augmentedMatrix = matrix.map((row) => [...row])
    const n = augmentedMatrix.length
    const eliminationSteps: number[][][] = [JSON.parse(JSON.stringify(augmentedMatrix))]


    for (let i = 0; i < n; i++) {
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
          maxRow = k
        }
      }

      [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]]
      eliminationSteps.push(JSON.parse(JSON.stringify(augmentedMatrix)))


      for (let k = i + 1; k < n; k++) {
        const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i]
        for (let j = i; j <= n; j++) {
          augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j]
        }
        eliminationSteps.push(JSON.parse(JSON.stringify(augmentedMatrix)))
      }
    }


    const x = new Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augmentedMatrix[i][n] / augmentedMatrix[i][i]
      for (let k = i - 1; k >= 0; k--) {
        augmentedMatrix[k][n] -= augmentedMatrix[k][i] * x[i]
      }
      eliminationSteps.push(JSON.parse(JSON.stringify(augmentedMatrix)))
    }
    setSolution(x)
    setSteps(eliminationSteps)
  }


  const navigateToSolution = () => {
    const timestamp = Date.now()
    localStorage.setItem("gaussianSteps", JSON.stringify(steps))
    localStorage.setItem("gaussianSolution", JSON.stringify(solution))
    navigate(`/solution/${timestamp}`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Gaussian Elimination Solver</h1>


      <div className={styles.inputSection}>
        <label>Matrix Size: </label>
        <input
          type="number"
          min="2"
          max="10"
          value={size}
          onChange={handleSizeChange}
        />
        <button className={styles.generateButton} onClick={generateMatrix}>
          Generate Matrix
        </button>
      </div>


      {matrix.length > 0 && (
        <div>
          <h2>Input Matrix (Augmented)</h2>
          <table className={styles.matrixTable} cellPadding="10">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((value, j) => (
                    <td key={j}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleMatrixChange(e, i, j)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>


          <button className={styles.solveButton} onClick={gaussianElimination}>
            Solve System
          </button>
        </div>
      )}


      {solution.length > 0 && (
        <div className={styles.solutionSection}>
          <h2>Solution</h2>
          <table className={styles.solutionTable} cellPadding="10">
            <tbody>
              {solution.map((x, i) => (
                <tr key={i}>
                  <td>{`x${i + 1}`}</td>
                  <td>{x.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className={styles.navigateButton} onClick={navigateToSolution}>
            View Full Solution
          </button>
        </div>
      )}
    </div>
  )
}
